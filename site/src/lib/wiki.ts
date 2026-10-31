// wiki 内容集合的统一读取入口（M4）：列表页、详情页、/api/wiki.json 共用，按编号排序。
import { getCollection, type CollectionEntry } from 'astro:content'
import type { WikiItem } from './types'

export type WikiEntry = CollectionEntry<'wiki'>

export async function getWikiEntries(): Promise<WikiEntry[]> {
  const entries = await getCollection('wiki')
  return entries.sort((a, b) => a.data.no.localeCompare(b.data.no))
}

/** 转为旧 WikiItem 结构（/api/wiki.json 向后兼容）并附带 slug / url */
export function toWikiItem(entry: WikiEntry): WikiItem & { slug: string; url: string; tags: string[] } {
  return {
    index: entry.data.no,
    title: entry.data.title,
    desc: entry.data.summary,
    tag: entry.data.tags[0],
    tags: entry.data.tags,
    slug: entry.id,
    url: `/wiki/${entry.id}/`,
  }
}
