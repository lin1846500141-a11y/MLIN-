"""MLIN Wiki API — Wiki entries and guestbook storage for the Next.js site."""

import json
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
WIKI_FILE = BASE_DIR / "wiki_data.json"
MESSAGES_FILE = BASE_DIR / "messages.json"
app = FastAPI(title="MLIN Wiki API", version="1.0.0")

# Next.js normally calls this service through same-origin Route Handlers.
# CORS remains open for local API inspection and compatibility with the old client.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    name: str = Field(..., min_length=1, max_length=20)
    message: str = Field(..., min_length=1, max_length=200)


def _read_json(path: Path):
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _write_json(path: Path, data) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


@app.get("/api/wiki")
def get_wiki():
    """返回全部 wiki 条目(从 wiki_data.json 读取)。"""
    return _read_json(WIKI_FILE)


@app.get("/api/health")
def health_check():
    """Render health check endpoint."""
    return {"status": "ok", "service": "mlin-wiki-api"}


@app.get("/api/messages")
def get_messages():
    """返回所有留言,最新的在前。"""
    return list(reversed(_read_json(MESSAGES_FILE)))


@app.post("/api/messages")
def add_message(msg: Message):
    """新增一条留言并持久化到 messages.json。"""
    messages = _read_json(MESSAGES_FILE)
    entry = {
        "name": msg.name,
        "message": msg.message,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    messages.append(entry)
    _write_json(MESSAGES_FILE, messages)
    return entry
