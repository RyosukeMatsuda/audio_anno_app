from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from starlette.websockets import WebSocketState
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pathlib import Path
import uuid

from backend.whisper_api import transcribe_audio
from backend.save_utils import append_result

app = FastAPI()

@app.post("/submit")
async def submit_text(payload: dict = Body(...)):
    """
    payload = {"pid": "abc123", "text": "sample text"}
    """
    pid = payload.get("pid", "unknown")
    text = payload.get("text", "")
    append_result(pid, text)
    return {"status": "saved"}

# ---------------- WebSocket ----------------
@app.websocket("/ws/audio")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    audio_buf = b""

    try:
        while True:
            msg = await ws.receive()

            # 1) バイナリデータを受信
            if msg["type"] == "websocket.receive" and msg.get("bytes"):
                audio_buf += msg["bytes"]

            # 2) テキスト "EOF" が来たら録音終了
            elif msg["type"] == "websocket.receive" and msg.get("text") == "EOF":
                #ファイル保存
                save_dir = Path("backend") / "temp_audio"
                save_dir.mkdir(parents=True, exist_ok=True)
                path = save_dir / f"temp_{uuid.uuid4().hex[:8]}.webm"
                path.write_bytes(audio_buf)

                #Whisper 転写
                try:
                    text = transcribe_audio(path)
                except Exception as e:
                    text = f"[Transcription error] {e}"

                #JSON で返信
                await ws.send_json({"event": "transcript", "text": text})
                await ws.close()
                break

    except WebSocketDisconnect:
        print("[WS] disconnected while recording")

# 静的ファイル
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse("/frontend/index.html")
