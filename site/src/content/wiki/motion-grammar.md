---
title: Motion Grammar
no: "02"
tags: [MOTION]
summary: 滚动负责叙事，悬停负责反馈；动效始终服务于阅读节奏。
---

## 三条规则

1. **滚动 = 叙事**：首页用 GSAP ScrollTrigger 把内容组织成一段段"镜头"，滚动推进剧情
2. **悬停 = 反馈**：卡片、按钮的变化必须即时且克制，不做与操作无关的装饰动画
3. **节奏优先**：任何动效若打断阅读，就删掉

## 实现取舍

- 动效库只在首页加载（GSAP + ScrollTrigger + Lenis），其他页面零动效脚本
- Lenis 与 ScrollTrigger 共用 `gsap.ticker`，不开第二个 RAF 循环
- 尊重 `prefers-reduced-motion`
