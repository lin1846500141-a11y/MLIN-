// /api/wiki.json —— 构建期静态接口（M3 起）。
// 替代旧站动态 functions/api/wiki.ts：wiki 条目在构建时内联为静态 JSON。
// M4：数据源改为 src/content/wiki/*.md 内容集合；保留旧字段（index/title/desc/tag），
// 新增 slug / url / tags 供外部消费。

import type { APIRoute } from 'astro'
import { getWikiEntries, toWikiItem } from '../../lib/wiki'

export const GET: APIRoute = async () => {
  const items = (await getWikiEntries()).map(toWikiItem)
  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'x-mlin-source': 'build-static',
    },
  })
}
