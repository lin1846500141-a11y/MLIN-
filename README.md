# MIKU x RAIN — Personal Wiki

赛博朋克风格个人 Wiki。前端纯 HTML/CSS/JS,后端 Python (FastAPI)。

## 目录结构

```
miku-wiki/
├── server.py          # Python 后端 (FastAPI)
├── requirements.txt   # Python 依赖
├── wiki_data.json     # Wiki 条目数据(后端读取)
├── messages.json      # 留言板数据(后端自动生成)
├── README.md
└── static/            # 前端
    ├── index.html
    ├── style.css
    ├── script.js
    ├── miku-bg.jpg    # (可选)背景图,自己放
    └── miku.mp3       # (可选)背景音乐,自己放
```

## 一、安装 Python(你当前还没装)

1. 打开 https://www.python.org/downloads/ 下载 Python 3.10+(Windows)。
2. 安装时**务必勾选 "Add Python to PATH"**。
3. 装完重开 PowerShell,验证:
   ```powershell
   python --version
   ```

## 二、安装依赖并启动后端

在 `miku-wiki` 目录下执行:

```powershell
# (推荐)建虚拟环境
python -m venv venv
.\venv\Scripts\Activate.ps1

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn server:app --reload
```

然后浏览器打开 **http://127.0.0.1:8000**

- 右上角状态灯变**绿色** = 后端已连接,Wiki 数据来自 Python,留言板可用。
- 交互式 API 文档:http://127.0.0.1:8000/docs

## 三、不开后端也能看

直接双击 `static/index.html` 也能打开,只是:
- Wiki 用内置的回退数据(状态灯**粉色**)。
- 留言板需要后端,会提示。

## 四、API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/api/wiki` | 返回所有 Wiki 条目 |
| GET  | `/api/messages` | 返回所有留言(最新在前) |
| POST | `/api/messages` | 新增留言 `{ "name": "...", "message": "..." }` |

## 五、部署上线

- **纯前端**(只要 `static/`):推到 GitHub → 开 GitHub Pages,免费拿公网链接(无后端,留言板不可用)。
- **带 Python 后端**:用 Render / Railway / Fly.io 等支持 Python 的平台,启动命令:
  ```
  uvicorn server:app --host 0.0.0.0 --port $PORT
  ```
