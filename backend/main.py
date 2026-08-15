"""
Miku Digital Archive — FastAPI 后端

- 提供 Wiki 数据与留言板读写接口(与原版接口契约一致)
- 托管 React/Vite 打包产物 frontend/dist(单服务部署,同源无 CORS 问题)

开发模式(前端另起 Vite dev server,并用代理转发 /api):
    cd backend && uvicorn main:app --reload

生产模式(Render):
    由 Dockerfile 构建前端后运行,详见 README.md
"""

import json
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
WIKI_FILE = BASE_DIR / "wiki_data.json"
MESSAGES_FILE = BASE_DIR / "messages.json"
DIST_DIR = BASE_DIR.parent / "frontend" / "dist"   # Vite 打包产物目录

app = FastAPI(title="Miku Digital Archive API", version="0.1.0")

# 本地开发若不用 Vite 代理、浏览器直连 8000 端口时需要跨域;
# 同源生产环境用不到,保留无害,可按需删除。
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


# 托管前端构建产物。必须放在 /api 路由之后,否则会拦截 API 请求。
if DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="frontend")
