# MLIN Wiki — Coastal Digital Archive

MLINStudio 的滚动式个人档案。新版视觉以夏日海岸摄影、锐利蓝白配色、超大编辑字体与细密信息网格为核心，不再使用旧版 Miku / 暗色赛博视觉。

## 技术栈

- Next.js 16 App Router + React 19 + TypeScript
- GSAP + ScrollTrigger：主页滚动叙事与视差
- Lenis：平滑滚动
- Motion：局部进入、筛选与 hover 反馈
- Tailwind CSS 4：主题 token 与基础样式管线
- FastAPI：Wiki 数据与留言 API
- Vercel：Next.js 前端
- Render：FastAPI 后端

## 目录

```text
MLIN-/
├── frontend/
│   ├── app/                 # App Router 页面与同源 API 代理
│   ├── components/          # 首页、导航、Wiki、留言板组件
│   ├── lib/                 # 类型、回退数据、内容配置
│   └── public/media/        # 优化后的原创海岸主视觉
├── backend/
│   ├── main.py              # /api/wiki、/api/messages、/api/health
│   ├── wiki_data.json
│   └── messages.json
├── Dockerfile               # Render API 镜像
└── render.yaml              # Render Blueprint
```

## 本地开发

需要两个终端：

```bash
# 终端 1：FastAPI
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

```bash
# 终端 2：Next.js
cd frontend
npm install
npm run dev
```

访问 `http://localhost:3000`。开发环境下，Next.js 的 `/api/messages` 默认代理到 `http://127.0.0.1:8000`；Wiki 在后端不可用时会使用本地索引，因此页面仍可浏览。

## 验证

```bash
cd frontend
npm run typecheck
npm run build
```

## 部署

### 1. Render 后端

在 Render 中使用仓库根目录的 `render.yaml` 创建 Blueprint，或按 `Dockerfile` 创建 Web Service。部署成功后可通过 `/api/health` 检查状态。

### 2. Vercel 前端

在 Vercel 导入同一 GitHub 仓库：

1. Root Directory 设为 `frontend`。
2. Framework Preset 选择 Next.js（通常会自动识别）。
3. 添加服务端环境变量：

```text
BACKEND_API_URL=https://mlin.onrender.com
```

4. 部署。浏览器只访问 Vercel 的同源 `/api/*`，真正的 Render 地址由 Next.js Route Handler 在服务端使用。

## 留言持久化

当前留言继续写入 `backend/messages.json`，与旧版接口兼容。Render 免费实例磁盘是临时的，重启或重新部署可能丢失写入内容。正式长期使用时建议迁移到 Postgres / Supabase，或为 Render 服务挂载持久化磁盘。

## 内容维护

- 首页三组内容：`frontend/lib/archive-data.ts`
- Wiki 后端数据：`backend/wiki_data.json`
- 全局设计 token 与响应式样式：`frontend/app/globals.css`
- 首页滚动时间线：`frontend/components/home/home-experience.tsx`
