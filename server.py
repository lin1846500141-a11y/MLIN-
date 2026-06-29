"""
MIKU x RAIN — Python 后端 (FastAPI)
-----------------------------------
职责:
  1. 提供 Wiki 数据接口      GET  /api/wiki
  2. 留言板读写(持久化到 JSON) GET/POST /api/messages
  3. 托管前端静态文件        /  ->  static/index.html

运行:
  pip install -r requirements.txt
  uvicorn server:app --reload
  浏览器打开 http://127.0.0.1:8000
"""
import json
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).parent
WIKI_FILE = BASE_DIR / "wiki_data.json"
MSG_FILE = BASE_DIR / "messages.json"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="MIKU x RAIN Wiki API")


# ---------- 工具:读写 JSON 文件 ----------
def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- 数据模型 ----------
class Message(BaseModel):
    name: str = Field(..., min_length=1, max_length=20)
    message: str = Field(..., min_length=1, max_length=200)


# ---------- API: Wiki 数据 ----------
@app.get("/api/wiki")
def get_wiki():
    """返回全部 wiki 条目(从 wiki_data.json 读取)。"""
    return load_json(WIKI_FILE, [])


# ---------- API: 留言板 ----------
@app.get("/api/messages")
def get_messages():
    """返回所有留言,最新的在前。"""
    msgs = load_json(MSG_FILE, [])
    return list(reversed(msgs))


@app.post("/api/messages")
def add_message(msg: Message):
    """新增一条留言并持久化到 messages.json。"""
    msgs = load_json(MSG_FILE, [])
    msgs.append({
        "name": msg.name.strip(),
        "message": msg.message.strip(),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
    })
    save_json(MSG_FILE, msgs)
    return JSONResponse({"ok": True}, status_code=201)


# ---------- 托管前端(必须放在最后,否则会拦截 /api) ----------
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
