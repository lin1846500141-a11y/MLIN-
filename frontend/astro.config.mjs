import { defineConfig } from 'astro/config';

// 静态站点：默认 output 即为 'static'。
// 部署：Cloudflare Pages，构建命令 npm run build，输出目录 dist。
// 服务端接口（/api/messages 留言板，/api/wiki）由 functions/ 目录的
// Pages Functions 提供，与构建产物无关。
export default defineConfig({
  site: 'https://mlin.pages.dev',
});
