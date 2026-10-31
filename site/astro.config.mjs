// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  // 纯静态输出（默认 outDir = dist/），部署 Cloudflare Pages 不变
  site: 'https://mlin.pages.dev',
  // M4：sitemap 排除 /api/ 静态接口，仅收录页面（含每条 /wiki/[slug]/）
  integrations: [sitemap({ filter: (page) => !page.includes('/api/') })],
})
