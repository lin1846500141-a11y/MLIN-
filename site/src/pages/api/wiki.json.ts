// /api/wiki.json —— 构建期静态接口（M3）。
// 替代旧站动态 functions/api/wiki.ts：wiki 条目在构建时内联为静态 JSON，
// 前端直接 fetch 该静态文件，省掉一次 Pages Function 调用。
// 数据源目前仍是 archive-data.ts 的 wikiFallback；M4 迁到 src/content/wiki/*.md 后改从这里读取内容集合。

import type { APIRoute } from 'astro'
import { wikiFallback } from '../../lib/archive-data'

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(wikiFallback), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'x-mlin-source': 'build-static',
    },
  })
}
