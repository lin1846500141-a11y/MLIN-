// Cloudflare Pages Function: GET /api/messages · POST /api/messages
// 替代原来的 Next.js Route Handler + FastAPI 后端。
// 留言持久化到 Cloudflare KV（在 Pages 项目设置里绑定命名空间 MLIN_KV）。
// 未绑定 KV 时返回 503，前端会显示离线状态（与旧行为一致）。

type StoredMessage = {
  name: string
  message: string
  time: string
}

type GuestbookKV = {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

type Env = {
  MLIN_KV?: GuestbookKV
}

type FunctionContext = {
  request: Request
  env: Env
}

const KV_KEY = 'guestbook:messages'

function nowLabel(): string {
  // "YYYY-MM-DD HH:MM"（北京时间），与旧后端格式保持一致。
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
}

async function readAll(env: Env): Promise<StoredMessage[]> {
  if (!env.MLIN_KV) return []
  const raw = await env.MLIN_KV.get(KV_KEY)
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? (data as StoredMessage[]) : []
  } catch {
    return []
  }
}

export const onRequestGet = async ({
  env,
}: FunctionContext): Promise<Response> => {
  if (!env.MLIN_KV) {
    return Response.json(
      { error: 'Message service is not configured' },
      { status: 503 },
    )
  }
  const messages = await readAll(env)
  return Response.json([...messages].reverse())
}

export const onRequestPost = async ({
  request,
  env,
}: FunctionContext): Promise<Response> => {
  if (!env.MLIN_KV) {
    return Response.json(
      { error: 'Message service is not configured' },
      { status: 503 },
    )
  }

  let payload: { name?: unknown; message?: unknown }
  try {
    payload = (await request.json()) as { name?: unknown; message?: unknown }
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const message =
    typeof payload.message === 'string' ? payload.message.trim() : ''
  if (!name || !message || name.length > 20 || message.length > 200) {
    return Response.json({ error: 'Invalid message' }, { status: 400 })
  }

  const messages = await readAll(env)
  const entry: StoredMessage = { name, message, time: nowLabel() }
  messages.push(entry)
  await env.MLIN_KV.put(KV_KEY, JSON.stringify(messages))
  return Response.json(entry, { status: 201 })
}
