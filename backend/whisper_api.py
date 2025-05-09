from openai import OpenAI, OpenAIError
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# APIキーを環境変数から直接取得します
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

client = OpenAI(api_key=api_key)

def transcribe_audio(file_path: Path) -> str:
    try:
        with file_path.open("rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                #language="ja",
            )
        return response.text
    except OpenAIError as e:
        print("[OpenAIError]", e.__class__.__name__, e)
        raise