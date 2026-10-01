export interface Work {
  no: string;
  tag: string;
  title: string;
  titleZh: string;
  desc: string;
  meta: string;
  /** 仍在整理中的条目：设为 true 时渲染"档案整理中"占位样式 */
  draft?: boolean;
}

/**
 * 代表作档案。
 * TODO: 把你的 2–4 件代表作按下面格式补进来（删掉 draft 条目即可）。
 * 建议每件一句话讲清楚：做了什么 / 用了什么 / 结果如何。
 */
export const works: Work[] = [
  {
    no: '01',
    tag: 'WEB / ARCHITECTURE',
    title: 'MLINStudio Rebuild',
    titleZh: '本站重构',
    desc: '从 Next.js 迁移到 Astro 5：分析站点真实需求后，移除了未被使用的服务端能力，构建更快、输出更干净，并建立了全站统一的动效语言（Lenis + GSAP + View Transitions）。',
    meta: 'ASTRO 5 · TYPESCRIPT · CLOUDFLARE PAGES',
  },
  {
    no: '02',
    tag: 'TOOL / INTERACTIVE',
    title: 'PC Builder',
    titleZh: '装机配置器',
    desc: '本站内置的 DIY 装机工具：按用途选择配件、实时生成配置单、带插槽兼容性检查。无价格、无后端，纯前端实现。',
    meta: 'ASTRO · VANILLA JS',
    draft: true,
  },
  {
    no: '03',
    tag: 'ARCHIVE',
    title: 'Open Slot',
    titleZh: '虚位以待',
    desc: '这一栏留给下一件作品：跨境电商视觉、硬件装配记录，或任何你想让人记住的东西。',
    meta: 'TODO — 把代表作发我，我来排版',
    draft: true,
  },
];
