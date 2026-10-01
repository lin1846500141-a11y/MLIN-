# MLINStudio — 海岸信号档案馆

个人工作室品牌站：展示向，不接单。一份可以滚动的个人档案——界面、机器、游戏与海。

**线上地址**：https://mlin.pages.dev
**部署**：Cloudflare Pages（构建命令 `npm run build`，输出目录 `dist`）+ Pages Functions（`functions/`）+ KV（留言板持久化）

## 技术栈

- **Astro 5**（`output` 纯静态导出）+ **TypeScript**
- 动效：**Lenis** 平滑滚动 + **GSAP**（ScrollTrigger 揭示 / 视差）+ Astro **View Transitions** 页面转场
- 字体：Anton（英文展示）/ 思源宋体 & 思源黑体 variable（中文）
- 后端：无。留言板走 Cloudflare Pages Functions + KV（`functions/api/messages.ts`）

### 为什么是 Astro 而不是 Next.js？

这个站点最初用 Next.js 构建，但审计后发现它的服务端能力一个都没用上：

1. 所有页面都是纯静态内容，没有 `getServerSideProps` / Server Actions
2. 图片优化已关闭（`images.unoptimized`），API 路由已迁移到 Pages Functions
3. 构建产物里 140KB 的 React 运行时没有任何交互收益——站内交互（留言板表单、装机配置器）用原生 JS 足够

于是重写为 Astro：同样的页面，构建从 ~40s 降到 ~3s，客户端 JS 只剩动效库和按需加载的岛。**选型原则：只为真实用到的能力付费。**

## 目录结构

```
frontend/
├── src/
│   ├── pages/          # 路由：index / about / works / builder / wiki / guestbook
│   ├── layouts/        # BaseLayout（SEO、字体、转场、动效入口）
│   ├── components/     # SiteHeader / SiteFooter / PageIntro
│   ├── data/           # 内容即数据：works.ts / wiki.ts / parts.ts（配件库与预设）
│   ├── scripts/        # motion.ts — 全站动效语言（Lenis + GSAP，监听 astro:page-load）
│   └── styles/         # global.css — 设计系统（token / 版式 / 组件样式）
├── public/             # 静态素材：characters（角色立绘）/ media / weapons
└── functions/api/      # Cloudflare Pages Functions：messages（KV 留言板）
```

## 动效语言

全站动效收敛在 `src/scripts/motion.ts` 一个入口，参数显式可查：

- `[data-reveal]`：进入视口时上浮 24px + 淡入，0.9s expo 缓动
- `[data-parallax]`：滚动视差，scrub 跟随
- 页面切换：View Transitions 淡入淡出 0.35s
- 统一缓动 `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`，`prefers-reduced-motion` 全站降级

## 本地开发

```bash
cd frontend
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出 dist/
```

留言板依赖 Cloudflare KV，本地 `dev` 下表单会显示离线状态——这是预期行为，不是 bug。

## 内容维护

- **作品**：改 `src/data/works.ts`，把 `draft` 条目替换成真实代表作
- **Wiki**：改 `src/data/wiki.ts`
- **装机配置器**：改 `src/data/parts.ts`（配件库 / 预设），页面自动渲染；兼容性规则目前检查 CPU–主板插槽
