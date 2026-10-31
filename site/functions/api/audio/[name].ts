// Cloudflare Pages Function: GET /api/audio/:name
// 优先从 Cloudflare R2 绑定（MLIN_R2）读取；若未配置绑定，则自动通过同源边缘流式代理 R2 公开桶（pub-322e0e2fe786460f982a341aa6ab65b2.r2.dev），
// 并附加 Access-Control-Allow-Origin: *，确保 Web Audio API (AnalyserNode.getByteFrequencyData) 100% 零跨域限制实时提取音频频率。

type R2ObjectBody = {
  body: ReadableStream
  size: number
  httpEtag?: string
  httpMetadata?: { contentType?: string }
}

type R2Bucket = {
  get(key: string): Promise<R2ObjectBody | null>
}

type Env = {
  MLIN_R2?: R2Bucket
  PUBLIC_R2_AUDIO_BASE?: string
}

type FunctionContext = {
  request: Request
  env: Env
  params: { name?: string }
}

const DEFAULT_R2_PUBLIC_BASE = 'https://pub-322e0e2fe786460f982a341aa6ab65b2.r2.dev'

const ALLOWED_TRACKS = new Set([
  'lemonade.mp3',
  'mengxing.mp3',
  'luoshengmen.mp3',
  'lengzhan.mp3',
  'dieforyou.mp3',
  'zenmele.mp3',
  'deadman.mp3',
  'xiaoxiaoqiji.mp3',
  'xingjubuxi.mp3',
  'dingxuan.mp3',
])

export const onRequestGet = async ({
  request,
  env,
  params,
}: FunctionContext): Promise<Response> => {
  const name = typeof params.name === 'string' ? params.name : ''
  if (!ALLOWED_TRACKS.has(name)) {
    return new Response('Track not found', { status: 404 })
  }

  // 1. 若绑定了 MLIN_R2 存储桶，直接内部零延迟读取
  if (env.MLIN_R2) {
    const obj = await env.MLIN_R2.get(name)
    if (obj) {
      const headers = new Headers()
      headers.set('Content-Type', obj.httpMetadata?.contentType || 'audio/mpeg')
      headers.set('Content-Length', String(obj.size))
      headers.set('Accept-Ranges', 'bytes')
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      headers.set('Access-Control-Allow-Origin', '*')
      if (obj.httpEtag) headers.set('ETag', obj.httpEtag)

      return new Response(obj.body, {
        status: 200,
        headers,
      })
    }
  }

  // 2. 自动从 mlinmusic R2 公开桶流式读取并同源返回（无需手动绑变量即可用）
  const base = (env.PUBLIC_R2_AUDIO_BASE || DEFAULT_R2_PUBLIC_BASE).replace(/\/$/, '')
  const upstreamUrl = `${base}/${name}`

  const upstreamHeaders = new Headers()
  const range = request.headers.get('Range')
  if (range) {
    upstreamHeaders.set('Range', range)
  }

  const upstream = await fetch(upstreamUrl, {
    headers: upstreamHeaders,
    cf: { cacheEverything: true, cacheTtl: 31536000 },
  } as RequestInit)

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`Upstream R2 returned ${upstream.status}`, { status: upstream.status })
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('Content-Type') || 'audio/mpeg')
  const contentLength = upstream.headers.get('Content-Length')
  if (contentLength) headers.set('Content-Length', contentLength)
  const contentRange = upstream.headers.get('Content-Range')
  if (contentRange) headers.set('Content-Range', contentRange)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  })
}
