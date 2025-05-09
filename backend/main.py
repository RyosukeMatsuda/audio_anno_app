from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定（フロントとの連携）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Audio Annotation API 起動中"}
