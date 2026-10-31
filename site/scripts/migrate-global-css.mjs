// 一次性迁移脚本（M0）：frontend/app/globals.css -> site/src/styles/global.css
// 改动：删除头部 @import "tailwindcss" 与 @theme 块（前 11 行），
// 其余逐行保留（含工作树中 GUESTBOOK 大字降档修复），仅前置一段来源注释。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const src = new URL('../../frontend/app/globals.css', import.meta.url)
const dst = new URL('../src/styles/global.css', import.meta.url)

const text = readFileSync(src, 'utf8')
const lines = text.split(/\r?\n/)
// 行 1 是 @import "tailwindcss"，行 3-10 是 @theme 块，行 2/11 为空行
const body = lines.slice(11).join('\n')

const header = `/* ============================================================
   MLIN v2 — global.css
   自 frontend/app/globals.css 平移（M0，2026-11-01）
   改动：移除 Tailwind（@import + @theme，全站工具类使用为零）；
   其余规则逐行保留，类名不变。含 GUESTBOOK 大字降档修复
   （.route-title min-width:0 + strong[data-long] 降档字号）。
   ============================================================ */

`

mkdirSync(dirname(dst.pathname.replace(/^\/([A-Za-z]:)/, '$1')), { recursive: true })
writeFileSync(dst, header + body, 'utf8')
console.log(`ok: ${lines.length} -> ${body.split('\n').length} 行（去掉头部 11 行，加 8 行注释）`)
