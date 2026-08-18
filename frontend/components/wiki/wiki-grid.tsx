'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { wikiFallback } from '@/lib/archive-data'
import type { WikiItem } from '@/lib/types'

const allTag = 'ALL'

export function WikiGrid() {
  const [items, setItems] = useState<WikiItem[]>(wikiFallback)
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(allTag)
  const [source, setSource] = useState<'local' | 'api'>('local')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/wiki', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json() as Promise<WikiItem[]>
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setItems(data)
          setSource('api')
        }
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const tags = useMemo(
    () => [allTag, ...Array.from(new Set(items.map((item) => item.tag.toUpperCase())))],
    [items],
  )

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return items.filter((item) => {
      const matchesTag = tag === allTag || item.tag.toUpperCase() === tag
      const matchesKeyword =
        !keyword ||
        `${item.title} ${item.desc} ${item.tag}`.toLocaleLowerCase().includes(keyword)
      return matchesTag && matchesKeyword
    })
  }, [items, query, tag])

  return (
    <section className="wiki-browser" aria-label="Wiki 条目">
      <div className="wiki-tools">
        <label className="wiki-search">
          <span>SEARCH / 检索</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="输入关键词"
          />
          <b>{String(filtered.length).padStart(2, '0')}</b>
        </label>
        <div className="wiki-tags" aria-label="筛选标签">
          {tags.map((item) => (
            <button
              className={tag === item ? 'is-active' : ''}
              type="button"
              onClick={() => setTag(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="wiki-source">SOURCE / {source === 'api' ? 'LIVE API' : 'LOCAL INDEX'}</span>
      </div>

      <motion.div className="wiki-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.article
              className="wiki-card"
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32 }}
              key={`${item.title}-${item.tag}`}
            >
              <div className="wiki-card-meta">
                <span>{item.index ?? String(index + 1).padStart(2, '0')}</span>
                <b>{item.tag}</b>
              </div>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <footer>
                <span>MLIN WIKI</span>
                <i>↗</i>
              </footer>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <strong>NO MATCHING RECORD</strong>
          <p>没有找到对应条目，试试更短的关键词。</p>
        </div>
      )}
    </section>
  )
}
