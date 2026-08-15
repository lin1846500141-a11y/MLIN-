# Miku Digital Archive — 个人 Wiki

编辑式极简风格个人 Wiki。前端 **React + Vite**,后端 **Python FastAPI**。

> 前端已从「纯 HTML/CSS/JS」迁移到 React，并采用大字体、大留白和 Miku 青的编辑式视觉系统。
> 后端接口契约(`/api/wiki`、`/api/messages`)**保持不变**,留言数据格式不变。

---

## 目录结构

```
miku-rain/
├── frontend/                 # React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js        # dev 时把 /api 代理到后端
│   ├── public/               # 可选背景音乐(miku.mp3)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           # 布局 + 视图容器 + 氛围层
│       ├── styles/global.css # 编辑式响应布局与全局视觉变量
│       ├── context/AppContext.jsx  # 主题/标签页/后端状态/音频 全局状态
│       ├── lib/              # api 封装、回退数据、标签页配置
│       └── components/
│           ├── Header.jsx
│           ├── Hero.jsx
│           ├── WikiView.jsx
│           ├── GuestbookView.jsx
│           └── AboutView.jsx
├── backend/                  # FastAPI
│   ├── main.py               # /api/wiki、/api/messages + 托管 frontend/dist
│   ├── requirements.txt
│   ├── wiki_data.json        # Wiki 数据(可编辑)
│   └── messages.json         # 留言持久化(运行时写入)
├── Dockerfile                # 生产构建:Node 构建前端 + Python 运行后端
├── render.yaml               # Render Blueprint
└── .gitignore
```

---

## 从旧项目迁移

旧项目是 `index.html + style.css + script.js + main.py` 平铺结构。迁移时只需把**数据与资源**搬进新位置,代码无需改动:

| 旧文件 | 新位置 | 说明 |
| --- | --- | --- |
| `wiki_data.json` | `backend/wiki_data.json` | 若你改过 Wiki 内容,请覆盖(仓库已内置原版 6 条) |
| `messages.json` | `backend/messages.json` | 若有历史留言,请覆盖(仓库内置为空 `[]`) |
| `miku.mp3` | `frontend/public/miku.mp3` | 可选 |

> 音频资源可选，缺失时首页其他功能不受影响。

---

## 本地开发

需要两个终端(或后台)分别跑前端和后端:

```bash
# 终端 1:后端(FastAPI,默认 8000 端口)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# 终端 2:前端(Vite dev server,默认 5173 端口,自动代理 /api)
cd frontend
npm install
npm run dev
```

浏览器打开 http://localhost:5173 。Vite 会把 `/api/*` 转发到 `localhost:8000`,无需处理跨域。

> 如果后端没启动:前端会自动回退到本地内置 Wiki 数据,留言板会提示需要后端。

---

## 生产构建 & 部署到 Render

### 方式 A:用 Docker(推荐,Render 原生支持)

仓库已提供 `Dockerfile` 和 `render.yaml`:

1. 把本目录推送到 GitHub 仓库。
2. Render 控制台 → **New + → Blueprint** → 选择该仓库。
3. Render 会自动读取 `render.yaml`,用 Docker 构建(Node 打前端包 → Python 跑后端)并部署。

也可以手动建 Docker 服务:Render → New → **Web Service** → 选仓库,`Runtime` 选 **Docker**,
构建/启动命令都已在 `Dockerfile` 里写好了。

### 方式 B:不用 Docker(本地构建,提交 dist)

Render 的 Python 运行环境**不带 npm**,所以要么用 Docker(方式 A),要么本地先把前端打好包、把 `dist/` 提交上去:

```bash
cd frontend
npm install
npm run build        # 生成 frontend/dist
```

然后把 `frontend/dist` 一并提交到仓库(Render 上使用 **Python** 运行时,启动命令
`cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`)。注意 `.gitignore` 默认忽略了
`frontend/dist`,走此方式时需移除该忽略行。

---

## 重要提示:留言数据的持久化

`messages.json` 是**文件级持久化**(与原版一致)。Render 免费实例的磁盘是**临时的**:
实例重启或重新部署后,写入的文件会丢失。如果希望留言长期保留,二选一:

1. 升级到 Render 付费计划并挂载 **Persistent Disk**(把 `messages.json` 放到持久化卷里);
2. 改用数据库(如 Render Postgres / SQLite 文件 + 持久化卷)。

> 本次迁移**没有改变数据模型**,迁移本身不会丢数据——但 Render 免费层重新部署本身就会重置磁盘,
> 这点与原版行为相同,并非本次改动引入。
