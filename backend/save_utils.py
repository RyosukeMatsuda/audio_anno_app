from pathlib import Path
import csv, json, datetime

SAVE_DIR = Path("backend") / "results"
SAVE_DIR.mkdir(parents=True, exist_ok=True)

CSV_PATH = SAVE_DIR / "results.csv"
JSON_PATH = SAVE_DIR / "results.jsonl"

if not CSV_PATH.exists():
    CSV_PATH.write_text("timestamp,pid,text\n", encoding="utf-8")

def append_result(pid:str, text:str):
    ts = datetime.datetime.utcnow().isoformat()

    with CSV_PATH.open("a", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow([ts, pid, text])

    with JSON_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"timestamp": ts, "pid": pid, "text": text}, ensure_ascii=False) + "\n")