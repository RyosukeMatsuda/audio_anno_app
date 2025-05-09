from pathlib import Path
import secrets, csv, json, datetime

SAVE_DIR = Path("backend") / "results"
SAVE_DIR.mkdir(parents=True, exist_ok=True)

CSV_PATH = SAVE_DIR / "results.csv"
JSON_PATH = SAVE_DIR / "results.jsonl"

COMPLETION_DIR = Path("backend") / "completion"
COMPLETION_DIR.mkdir(parents=True, exist_ok=True)
MAP_PATH = COMPLETION_DIR / "code_map.json"

if not CSV_PATH.exists():
    CSV_PATH.write_text("timestamp,pid,text\n", encoding="utf-8")

def append_result(pid:str, text:str):
    ts = datetime.datetime.utcnow().isoformat()

    with CSV_PATH.open("a", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow([ts, pid, text])

    with JSON_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"timestamp": ts, "pid": pid, "text": text}, ensure_ascii=False) + "\n")
    
def make_code(pid: str) -> str:
    code =secrets.token_urlsafe(6)[:8]
    mapping ={}

    if MAP_PATH.exists():
        mapping = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    
    mapping[pid] = code
    MAP_PATH.write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    return code

