import { FALLBACK_WIKI } from './fallback.js'

async function fetchJSON(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 拉取 Wiki(失败回退到本地内置数据)
export async function fetchWiki() {
  try {
    const data = await fetchJSON('/api/wiki')
    return { data, online: true }
  } catch {
    return { data: FALLBACK_WIKI, online: false }
  }
}

export function fetchMessages() {
  return fetchJSON('/api/messages')
}

export function postMessage(name, message) {
  return fetchJSON('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message }),
  })
}
