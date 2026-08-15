import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { fetchMessages, postMessage } from '../lib/api.js'

export default function GuestbookView() {
  const { tab, setApiOnline } = useApp()
  const [messages, setMessages] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [offline, setOffline] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await fetchMessages()
      setMessages(data)
      setApiOnline(true)
      setOffline(false)
    } catch {
      setApiOnline(false)
      setOffline(true)
    } finally {
      setLoaded(true)
    }
  }, [setApiOnline])

  // 进入留言板时刷新(与原版一致)
  useEffect(() => {
    if (tab === 'guestbook') load()
  }, [tab, load])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || sending) return
    setSending(true)
    try {
      await postMessage(name.trim(), message.trim())
      setName('')
      setMessage('')
      await load()
    } catch {
      alert('发送失败:请确认 Python 后端已启动(见 README)')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 25 }}>
        GUEST <span>BOOK</span>
      </h1>
      <form className="guestbook-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="你的昵称"
          maxLength={20}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="留下你的足迹..."
          rows={3}
          maxLength={200}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={sending}>
          {sending ? '发送中…' : '发送留言'}
        </button>
      </form>

      <div id="msg-list">
        {!loaded ? null : offline ? (
          <p className="no-result">// 留言板需要启动 Python 后端(见 README)</p>
        ) : messages.length === 0 ? (
          <p className="no-result">// 还没有留言,来做第一个吧</p>
        ) : (
          messages.map((m, i) => (
            <div className="msg-item" key={i}>
              <div className="meta">
                {m.name} · {m.time}
              </div>
              <div className="body">{m.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
