// 内容集合（M4）：wiki 条目从 archive-data.ts 的 wikiFallback 迁到 src/content/wiki/*.md。
// 文件名即 slug → /wiki/[slug]；frontmatter 字段：title / tags / no / summary。
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wiki' }),
  schema: z.object({
    title: z.string(),
    /** 第一个标签为主标签（列表卡片与筛选按钮使用） */
    tags: z.array(z.string()).min(1),
    /** 档案编号，两位字符串，如 "01"；同时决定排序 */
    no: z.string().regex(/^\d{2}$/),
    summary: z.string(),
    updated: z.coerce.date().optional(),
  }),
})

export const collections = { wiki }
