"""
MIKU x RAIN — Python 后端 (FastAPI)
-----------------------------------
存储:
  - 配了环境变量 DATABASE_URL  -> 用 PostgreSQL 永久保存(线上)
  - 没配                      -> 用本地 messages.json(本地开发)
通知:
  - 配了 SMTP_USER / SMTP_PASS -> 每条留言自动发邮件到 MAIL_TO

运行(本地):
  pip install -r requirements.txt
  uvicorn server:app --reload
"""
import os
import json
import smtplib
from email.message import EmailMessage
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).parent
WIKI_FILE = BASE_DIR / "wiki_data.json"
MSG_FILE = BASE_DIR / "messages.json"
STATIC_DIR = BASE_DIR / "static"
DATABASE_URL = os.environ.get("DATABASE_URL")

app = FastAPI(title="MIKU x RAIN Wiki API")


# ---------- 工具:读写 JSON ----------
def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- 数据库层(仅当配了 DATABASE_URL 时启用) ----------
def init_db():
    if not DATABASE_URL:
        return
    import psycopg
    with psycopg.connect(DATABASE_URL) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id      SERIAL PRIMARY KEY,
                name    TEXT NOT NULL,
                message TEXT NOT NULL,
                time    TEXT NOT NULL
            )
            """
        )
        conn.commit()


def db_add_message(name, message, time):
    import psycopg
    with psycopg.connect(DATABASE_URL) as conn:
        conn.execute(
            "INSERT INTO messages (name, message, time) VALUES (%s, %s, %s)",
            (name, message, time),
        )
        conn.commit()


def db_get_messages():
    import psycopg
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute(
            "SELECT name, message, time FROM messages ORDER BY id DESC"
        ).fetchall()
    return [{"name": r[0], "message": r[1], "time": r[2]} for r in rows]


@app.on_event("startup")
def _startup():
    try:
        init_db()
        print("storage:", "PostgreSQL" if DATABASE_URL else "local messages.json")
    except Exception as e:
        print("init_db failed:", e)


# ---------- 邮件通知(仅当配了 SMTP 时启用) ----------
def send_email(name, message, time):
    user = os.environ.get("SMTP_USER")
    pwd = os.environ.get("SMTP_PASS")
    to = os.environ.get("MAIL_TO", user)
    if not (user and pwd):
        return
    try:
        em = EmailMessage()
        em["Subject"] = f"[MIKU x RAIN] 新留言来自 {name}"
        em["From"] = user
        em["To"] = to
        em.set_content(f"昵称:{name}\n时间:{time}\n\n留言内容:\n{message}")
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as s:
            s.login(user, pwd)
            s.send_message(em)
        print("notify email sent ->", to)
    except Exception as e:
        print("send_email failed:", e)


# ---------- 数据模型 ----------
class Message(BaseModel):
    name: str = Field(..., min_length=1, max_length=20)
    message: str = Field(..., min_length=1, max_length=200)


# ---------- API: Wiki ----------
@app.get("/api/wiki")
def get_wiki():
    return load_json(WIKI_FILE, [])


# ---------- API: 留言板 ----------
@app.get("/api/messages")
def get_messages():
    if DATABASE_URL:
        return db_get_messages()
    return list(reversed(load_json(MSG_FILE, [])))


@app.post("/api/messages")
def add_message(msg: Message, bg: BackgroundTasks):
    time = datetime.now().strftime("%Y-%m-%d %H:%M")
    name = msg.name.strip()
    message = msg.message.strip()
    # 1) 存储
    if DATABASE_URL:
        db_add_message(name, message, time)
    else:
        msgs = load_json(MSG_FILE, [])
        msgs.append({"name": name, "message": message, "time": time})
        save_json(MSG_FILE, msgs)
    # 2) 后台发邮件(不阻塞响应)
    bg.add_task(send_email, name, message, time)
    return JSONResponse({"ok": True}, status_code=201)


# ---------- 托管前端(必须放最后) ----------
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
