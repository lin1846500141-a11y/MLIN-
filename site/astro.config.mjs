// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  // 纯静态输出（默认 outDir = dist/），部署 Cloudflare Pages 不变
  site: 'https://mlin.pages.dev',
  integrations: [sitemap()],
})
