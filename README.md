# MLIN Wiki — Coastal Digital Archive

MLINStudio 的滚动式个人档案。新版视觉以夏日海岸摄影、锐利蓝白配色、超大编辑字体与细密信息网格为核心，不再使用旧版 Miku / 暗色赛博视觉。

## 技术栈

- Next.js 16 App Router + React 19 + TypeScript（静态导出 `output: 'export'`）
- GSAP + ScrollTrigger：主页滚动叙事与视差
- Lenis：平滑滚动
- Motion：局部进入、筛选与 hover 反馈
- Tailwind CSS 4：主题 token 与基础样式管线
- Cloudflare Pages：托管静态构建产物
- Cloudflare Pages Functions + KV：`/api/wiki`、`/api/messages`（留言板）动态接口

## 目录

```text
MLIN-/
├── frontend/
│   ├── app/                 # App Router 页面（全部静态渲染）
│   ├── components/          # 首页、导航、Wiki、留言板组件
│   ├── functions/api/       # Pages Functions：wiki.ts、messages.ts
│   ├── lib/                 # 类型、回退数据、内容配置
│   └── public/media/        # 优化后的原创海岸主视觉
└── README.md
```

历史说明：仓库曾包含 FastAPI 后端（`backend/`）与 Render Docker 部署配置，
2026-09 迁移到 Cloudflare Pages 时已移除——后端逻辑改写为 Pages Functions，
废弃素材（`about-gallery/`、`weapons/`、旧视频等）已从工作树删除，
需要时可从 Git 历史找回。

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:3000`。Wiki 在接口不可用时使用本地索引兜底，页面仍可浏览。

## 验证

```bash
cd frontend
npm run typecheck
npm run build   # 产物输出到 frontend/out/
```

## 部署（Cloudflare Pages）

1. 在 Cloudflare Dashboard 创建 Pages 项目，连接本仓库，
   构建设置：根目录 `frontend`，构建命令 `npm run build`，输出目录 `out`。
2. 创建一个 KV 命名空间（例如 `mlin-guestbook`），
   在 Pages 项目的 **Settings → Functions → KV namespace bindings** 中绑定，
   变量名填 `MLIN_KV`。不绑定时留言板会显示离线状态，Wiki 不受影响。
3. 推送到生产分支即自动构建部署。

路由：

- `/`：MLIN Wiki 首页
- `/wiki`、`/guestbook`、`/about`：内容页（纯静态）
- `/api/wiki`：Wiki 条目（Pages Function，静态数据）
- `/api/messages`：留言板读写（Pages Function + KV）

## 内容维护

- 首页三组内容：`frontend/lib/archive-data.ts`
- Wiki 条目：`frontend/functions/api/wiki.ts`（与 `lib/archive-data.ts` 中的 fallback 保持一致）
- 全局设计 token 与响应式样式：`frontend/app/globals.css`
- 首页滚动时间线：`frontend/components/home/home-experience.tsx`
