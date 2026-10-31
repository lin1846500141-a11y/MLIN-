# MLIN Wiki — Coastal Signal Archive

MLINStudio 的滚动式个人档案站（https://mlin.pages.dev）。视觉以夏日海岸摄影、锐利蓝白配色、超大编辑字体与细密信息网格为核心。

> 完整架构定案与后续功能路线见 [`REWRITE-PLAN.md`](./REWRITE-PLAN.md)。

## 技术栈

- **Astro 5**（纯静态输出，零 React / 零 Tailwind 运行时）
- **GSAP + ScrollTrigger + Lenis**：仅首页按需加载滚动叙事、平滑滚动与双层视差
- **Content Collections**：Wiki 条目以 Markdown（`site/src/content/wiki/*.md`）维护，构建期生成独立详情页 `/wiki/[slug]/` 与静态索引 `/api/wiki.json`
- **Cloudflare Pages + Pages Functions + KV**：托管静态产物 `site/dist/`，`/api/messages` 驱动留言板（绑定 `MLIN_KV`，预埋 Turnstile 校验）

## 目录结构

```text
MLIN-/
├── site/
│   ├── astro.config.mjs            # Astro 5 + @astrojs/sitemap 配置
│   ├── functions/api/messages.ts   # Cloudflare Pages Function（留言板 KV 读写）
│   ├── public/                     # 静态媒体资产、favicon.svg、robots.txt
│   └── src/
│       ├── components/             # home / site / wiki / guestbook 组件
│       ├── content/wiki/           # Wiki Markdown 档案条目
│       ├── layouts/                # Base.astro / InnerPage.astro
│       ├── pages/                  # index / wiki / wiki/[slug] / guestbook / about
│       └── styles/global.css       # 全站设计 token 与编辑网格样式
├── design/                         # 新首屏定稿参考图
└── REWRITE-PLAN.md                 # 唯一权威重写与功能规格书
```

## 本地开发与验证

```bash
cd site
npm install
npm run dev         # 本地开发服务
npm run typecheck   # astro check 类型检查
npm run build       # 构建纯静态产物到 site/dist/
```

## 部署（Cloudflare Pages）

1. 在 Cloudflare Dashboard 连接本仓库，生产分支 `main`：
   - **Root directory**：`site`
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
2. 在 **Settings → Functions → KV namespace bindings** 绑定变量名 `MLIN_KV`。
3. 如需开启留言板人机验证，配置环境变量 `PUBLIC_TURNSTILE_SITE_KEY` 与 `TURNSTILE_SECRET_KEY`。
