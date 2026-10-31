// Cloudflare Pages Function: GET /api/messages · POST /api/messages
// 自 frontend/functions/api/messages.ts 原样搬入（M3），KV 读写逻辑不动，
// 绑定名 MLIN_KV 不变；未绑定 KV 时返回 503，前端显示离线态（与旧行为一致）。
//
// M3 增：Turnstile 防滥用「预埋」——仅当环境配置了 TURNSTILE_SECRET_KEY 时才校验，
// 未配置则跳过校验（不阻断留言），供后续 BUILDER 晒单社区四件套复用同一套校验函数。

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
  TURNSTILE_SECRET_KEY?: string
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

/**
 * Turnstile 预埋校验：未配置密钥时直接放行（不阻断）；配置后调用 Cloudflare
 * siteverify 验证前端提交的 token，失败返回 false。
 */
async function verifyTurnstile(
  request: Request,
  env: Env,
  token: unknown,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || token.length === 0) return false

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  const remoteip = request.headers.get('CF-Connecting-IP')
  if (remoteip) form.append('remoteip', remoteip)

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form },
    )
    const data = (await response.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
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

  let payload: { name?: unknown; message?: unknown; token?: unknown }
  try {
    payload = (await request.json()) as {
      name?: unknown
      message?: unknown
      token?: unknown
    }
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const message =
    typeof payload.message === 'string' ? payload.message.trim() : ''
  if (!name || !message || name.length > 20 || message.length > 200) {
    return Response.json({ error: 'Invalid message' }, { status: 400 })
  }

  const ok = await verifyTurnstile(request, env, payload.token)
  if (!ok) {
    return Response.json({ error: 'Turnstile verification failed' }, { status: 403 })
  }

  const messages = await readAll(env)
  const entry: StoredMessage = { name, message, time: nowLabel() }
  messages.push(entry)
  await env.MLIN_KV.put(KV_KEY, JSON.stringify(messages))
  return Response.json(entry, { status: 201 })
}
