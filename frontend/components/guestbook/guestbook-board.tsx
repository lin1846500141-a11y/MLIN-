'use client'

import { motion } from 'motion/react'
import { type FormEvent, useCallback, useEffect, useState } from 'react'
import type { GuestbookMessage } from '@/lib/types'

type BoardState = 'loading' | 'ready' | 'offline'

export function GuestbookBoard() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [state, setState] = useState<BoardState>('loading')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/messages', { cache: 'no-store' })
      if (!response.ok) throw new Error('offline')
      const data = (await response.json()) as GuestbookMessage[]
      setMessages(Array.isArray(data) ? data : [])
      setState('ready')
    } catch {
      setState('offline')
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !message.trim() || sending) return
    setSending(true)
    setNotice('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      if (!response.ok) throw new Error('send failed')
      setName('')
      setMessage('')
      setNotice('留言已记录 / RECORD SAVED')
      await load()
    } catch {
      setState('offline')
      setNotice('暂时无法连接留言服务，请稍后重试。')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="guestbook-board">
      <form className="guestbook-form" onSubmit={submit}>
        <div className="form-heading">
          <span>NEW COORDINATE / 001</span>
          <h2>LEAVE A<br />SIGNAL.</h2>
          <p>留下一句话。昵称最多 20 个字符，正文最多 200 个字符。</p>
        </div>
        <label>
          <span>01 / NAME</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={20}
            placeholder="你的昵称"
            required
          />
        </label>
        <label>
          <span>02 / MESSAGE</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={200}
            rows={5}
            placeholder="留下一条记录……"
            required
          />
          <b>{message.length} / 200</b>
        </label>
        <button type="submit" disabled={sending}>
          <span>{sending ? 'TRANSMITTING…' : 'SEND RECORD'}</span>
          <b>↗</b>
        </button>
        {notice && <p className="form-notice" role="status">{notice}</p>}
      </form>

      <div className="message-log">
        <header>
          <span>RECEIVED SIGNALS</span>
          <b>{state === 'ready' ? String(messages.length).padStart(2, '0') : '--'}</b>
        </header>

        {state === 'loading' && <p className="board-status">CONNECTING TO ARCHIVE…</p>}
        {state === 'offline' && (
          <div className="board-status is-offline">
            <i />
            <strong>MESSAGE SERVICE OFFLINE</strong>
            <p>页面仍可浏览；留言服务连接后会自动恢复。</p>
            <button type="button" onClick={() => { setState('loading'); void load() }}>RETRY ↻</button>
          </div>
        )}
        {state === 'ready' && messages.length === 0 && (
          <div className="board-status">
            <strong>THE LOG IS QUIET.</strong>
            <p>还没有留言，你可以成为第一条记录。</p>
          </div>
        )}
        {state === 'ready' && messages.map((item, index) => (
          <motion.article
            className="message-item"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.4) }}
            key={`${item.name}-${item.time}-${index}`}
          >
            <div><span>{String(index + 1).padStart(2, '0')}</span><time>{item.time}</time></div>
            <h3>{item.name}</h3>
            <p>{item.message}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
