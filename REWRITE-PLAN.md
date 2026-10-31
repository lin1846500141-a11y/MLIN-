# MLIN v2 重写规格书（唯一权威文档 · 已定稿）

> **读者须知**：本文档面向所有参与本项目的 AI 与开发者。所有架构决策已经用户确认定稿，
> **"定案"表中的内容不要再讨论或提出替代方案**；发现文档与代码冲突时，以本文档为准，
> 并提醒用户更新文档。执行顺序按里程碑，每个里程碑独立提交、独立验收。

## 0. 项目概况

- 站点：https://mlin.pages.dev —— MLINStudio /「Coastal Signal Archive」个人档案站（中文为主）
- 概念：把个人站做成"海岸信号档案"——简历 = PERSONNEL FILE，留言 = RECEIVED SIGNALS，
  配置单 = BUILDER，音乐 = SIGNAL FM。所有新功能都装进这个档案隐喻，不做通用博客感
- 仓库：github.com/lin1846500141-a11y/MLIN-（public，main 分支），本地克隆于工作区 `MLIN-/`
- 托管：Cloudflare Pages 项目 `mlin`（push main 自动构建部署）；KV 绑定名 `MLIN_KV`
- 用户：非专业开发者，中文交流；方案先行，代码后动

## 1. 现状盘点（将被替换的旧站）

- 技术栈：Next.js 16.3.1 App Router（`output: 'export'` 静态导出）+ React 19 + TypeScript；
  GSAP + ScrollTrigger（首页滚动叙事，`useGSAP` 管理）；Lenis（仅子页，已正确共用
  `gsap.ticker` + `ScrollTrigger.update`，无第二 RAF）；Motion；Tailwind v4（实际零工具类，
  只有 `@theme` token）；Pages Functions + KV
- 页面：`/`（重组件首页）、`/wiki`（搜索 + 7 个标签筛选，数据源 `functions/api/wiki.ts`）、
  `/guestbook`（KV 留言板，读 `/api/messages`）、`/about`
- 关键文件：`components/home/home-experience.tsx`（首页全部动效时间线 + 鼠标视差）、
  `components/site/site-header.tsx`、`components/wiki/wiki-grid.tsx`、
  `components/guestbook/guestbook-board.tsx`、`components/motion/smooth-scroll-provider.tsx`
- 资产：`public/media/coastal-archive-hero-v2.webp`（1672×941，230KB）、
  `coastal-hero.webp`（1672×941，113KB）
- 全站 JS 约 859KB（12 chunk）——重写的首要动机之一就是减脂

## 2. 定案（不再讨论）

| 项 | 决策 |
|---|---|
| 框架 | **Astro 5，纯静态输出**，全站重写 |
| React | **全部移除**（next/react/react-dom/motion/@gsap/react 一并删除），交互改 vanilla TS `<script>` |
| 动效 | GSAP + ScrollTrigger + Lenis 只在首页孤岛加载（现有集成写法已正确，照搬） |
| 部署 | **Cloudflare Pages 不变**，域名 mlin.pages.dev 不变；Workers/Durable Objects 明确不用 |
| 后端 | Pages Functions + KV 原样（guestbook）；wiki API 改构建期静态 json；D1 暂不上 |
| 音乐 | R2 存音频，精选曲目，默认静音不自动播放（SIGNAL FM，最后做） |
| 样式 | `frontend/app/globals.css` 平移进新站，**移除 Tailwind**（工具类使用为零）；类名不变，视觉零回归 |
| 已否决 | shadcn/ui（React 库 + 通用 AI 味）、Supabase/Vercel Postgres/Waline（外部平台依赖，Supabase 免费档闲置一周休眠）、SvelteKit/Remix（无对应需求）、Vercel 部署、Durable Objects（无实时需求） |

## 3. 目标结构

```
MLIN-/
├── frontend/        # 旧 Next 站，迁移期保留（线上还在跑它），M5 剪彩后删除
├── site/            # 新 Astro 站
│   ├── astro.config.mjs            # site: mlin.pages.dev + sitemap
│   ├── src/styles/global.css       # 平移（删 tailwind 导入和 @theme，保留 :root token）
│   ├── src/layouts/Base.astro      # SEO head + 页头（首页也用它）
│   ├── src/layouts/InnerPage.astro # 内页壳：main.inner-page + inner-footer（M0 实现时从 Base 拆出：
│   │                               #   旧站 footer 在 main 内部，放 Base 会破坏 DOM/视觉零回归）
│   ├── src/components/             # home/ site/ wiki/ guestbook/（.astro 模板 + TS 脚本）
│   ├── src/pages/                  # index / wiki/[slug] / about / guestbook
│   ├── src/pages/api/wiki.json.ts  # 构建期静态接口，替代 functions/api/wiki.ts
│   ├── src/content/wiki/*.md       # 6 条 wiki 条目迁 markdown（frontmatter: title/tags/no/summary）
│   ├── functions/api/messages.ts   # 留言板 Function 原样搬入（KV 逻辑不动）
│   └── public/media/               # 图片原样
├── design/          # 定稿设计参考图
└── REWRITE-PLAN.md  # 本文档
```

## 4. 依赖终态（site/package.json）

```jsonc
{
  "dependencies": { "astro": "^5", "gsap": "^3.13", "lenis": "^1.3" },
  "devDependencies": { "@astrojs/sitemap": "^3" }
}
// 移除：next, react, react-dom, motion, @gsap/react, tailwindcss, @tailwindcss/postcss
```

## 5. 逐页 JS 预算

| 页面 | 现状 | 目标 |
|---|---|---|
| `/` | 全站 React 运行时 + GSAP + Lenis + Motion | 仅首页加载 GSAP+ScrollTrigger+Lenis（约 60–70KB gz），无框架运行时 |
| `/wiki` | 全套 React + Motion 筛选 | 静态 HTML + ~2KB 筛选脚本（构建期生成索引 JSON） |
| `/about` | 全套 React | **0 JS** |
| `/guestbook` | 全套 React + Motion | 表单 fetch 脚本 ~3KB |

## 6. 里程碑（每个 = 一次独立提交 + 验收）

- **M0** `site/` 脚手架 + global.css 平移 + Base 布局 + 页头页脚（验收：`npm run build` 通）
  — ✅ 2026-11-01 完成：`astro check` 0 错误 + `npm run build` 通过（1 页 + sitemap，CSS 36.7KB 无 Tailwind）。
  页头为 vanilla TS（移动端菜单 clip-path 过渡替代 motion）；首页为占位页，M1 替换
- **M1** 四页静态化，类名与现站一致（验收：与线上站 1440/1000/390 三档截图对比无明显回归）
- **M2** 首页动效移植：开场字幕时间线 + 滚动叙事 + Lenis + 鼠标视差；顺带修两个已知 bug（见 §9）（验收：三档截图 + 动画手感）
- **M3** guestbook 接回 Functions（原文件搬入）+ wiki 静态 json + Turnstile 预埋（验收：留言可发可读）
- **M4** wiki 迁 `.md` + `/wiki/[slug]` 详情页（旧站没有的增量）+ sitemap/robots/favicon/og/canonical 全套 SEO（验收：每条 wiki 有独立 URL）
- **M5** 用户在 Cloudflare Pages 后台把构建根目录 `frontend`→`site`、输出目录 `out`→`dist`，合 main 部署，稳定 24h 后删 `frontend/`
- 后续功能序：**首页 UI 爆改（Miku 新首屏）→ BUILDER 晒单社区 → PC 配置单 → SIGNAL FM**
- 提交规范：分支 `refactor/astro-m0` 这样按里程碑命名；默认只推分支，合 main 由用户操作

## 7. 首页 UI 定稿（用户已拍板"就做成这样"）

- 定稿参考图：`design/home-hero-final-reference.png`（21:9 电影感合成：写实江ノ電海岸 + Miku 坐于站台）
- 结构要点：顶部导航 HOME/ARCHIVE/PROJECTS/ABOUT；右侧索引栏 **01/02（轮播共 2 张）** +
  IN SERVICE / FIELD NOTES + 指示点 + SCROLL DOWN；底栏 波形图标 +
  `35.2149° N / 139.3467° E` 坐标 + 下张预告编号；左侧 ARCHIVE 大字 + 双语副标 +
  tagline + ENTER ARCHIVE CTA
- **生成最终资产前必须修的 mockup 瑕疵**：
  1. 左上 logo 生成成了 "**WLEN**Studio"，站名是 **MLIN**Studio——重生成或后期修字
  2. 右栏指示点 4 个与分页 01/02 不一致，统一为 2
  3. 第 2 张轮播场景未定——需再产出一张（建议同机位黄昏/夜变奏，保持构图语言成对）
- **导航命名映射待定**：现站 INDEX/WIKI/GUESTBOOK/ABOUT → 效果图 HOME/ARCHIVE/PROJECTS/ABOUT。
  倾向：ARCHIVE→/wiki，PROJECTS→/builder，GUESTBOOK 去向落地时定
- 资产导出清单：21:9 / 16:9 / 3:4 三套裁切 + 无文字干净版（兼 og:image）+ 人物/背景分层版
  （双层视差），AVIF/WebP，LCP 图 ≤250KB；Miku 形象仅限非商用（Piapro 条款）

## 8. BUILDER 晒单社区 v0 规格（朋友圈模式，无登录）

- 数据：`{ id, 署名≤20, 联系方式≤50选填, 描述≤200, 图片≤4, 规格表: {PCB, 声音包, 外壳, 轴体, 卫星轴, 键帽, 其他}, createdAt }`
- 防滥用四件套：Turnstile + 同 IP 10 分钟冷却（KV TTL 计数）+ 发布成功返回管理链接
  （随机 token，发帖人自删自改）+ 站长 admin key 下架
- 图片：前端 canvas 压缩 ≤1600px / 单张 ≤400KB → Worker 收 multipart 写 R2 → 卡片直链
- 存储：KV v0（阈值 ~500 帖迁 D1，字段结构兼容）；UI 朋友圈式卡片流，**发帖表格即配置单**；
  v1 再加"选择器模式"（选配件自动生成表格）

## 9. 已知 bug（M2 顺手修，修法已定）

1. **GUESTBOOK 大字与描述重叠**（桌面 1440px）：`.route-title strong` 现为
   `clamp(48px, 7vw, 112px)`，9 字母的 GUESTBOOK 溢出 43% 网格列。修法：长词（>6 字符）
   加 `data-long` 降档 `clamp(38px, 5.5vw, 88px)`，`.route-title` 加 `min-width: 0`。
   （frontend/app/globals.css 已有半成品改动，M0 时决定保留或重做）
   → **M0 已决策：保留**。CSS 半段已随平移进入 `site/src/styles/global.css`
   （`min-width: 0` + `strong[data-long]` 规则）；`data-long` 属性在 M1 静态化
   guestbook 页时按"标题 >6 字符"条件补上。frontend/ 工作树改动随 M0 一并提交（对旧站惰性，无视觉影响）
2. **移动端 hero 标题裁成 "ARCHI"**：`.hero-word-scale` 的 `scaleX(.57)` 按桌面 29vw 字号标定，
   移动端改 36vw 后没同步。修法：**运行时实测文字宽度**（约 10 行脚本，监听 resize +
   `document.fonts.ready`）写 `--hero-word-fit` CSS 变量替代魔法常数，桌面移动都完整显示。

## 10. 环境与工具（Windows 开发机）

- 系统 PATH **没有** git / node / gh / python
- 便携 git：`C:\Users\Administrator\.zcode\tools\git-portable\cmd\git.exe`
- Node 22.23.4 + npm：`C:\Users\Administrator\.zcode\tools\node\node-v22.23.4-win-x64\`
  （各次命令间 PATH 不保留，用前重设；frontend/ 依赖已 npm install）
- GitHub token：`C:\Users\Administrator\.zcode\tools\.gh_token`（读权限已验证，
  **Contents:Write 未验证**，推送前先试；完成后提醒用户吊销）
- winget 商店源损坏，装软件走 GitHub release 直链 + curl + PowerShell 解压
- PowerShell 控制台默认 GBK，处理 UTF-8 JSON 前先设
  `[Console]::OutputEncoding=[Text.Encoding]::UTF8`
- 本地验证流程：typecheck → `npm run build` → 无依赖 node 静态服务脚本 → 浏览器三档截图

## 11. 待用户动作（AI 勿代办）

- M5 时在 Cloudflare 后台改两个构建配置值（root directory / output directory）
- 提供带 Contents: Write 的 token（或自行推送、合并 main）
- 最终首屏资产按 §7 清单产出（含 WLEN→MLIN 修正 + 第 2 张轮播场景）——首页爆改阶段才需要
