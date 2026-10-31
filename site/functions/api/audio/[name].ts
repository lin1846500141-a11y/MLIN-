// Cloudflare Pages Function: GET /api/audio/:name
// 从 Cloudflare R2 桶（绑定名 MLIN_R2）流式读取 SIGNAL FM 音频文件并同源返回，
// 保证前端 Web Audio API (AnalyserNode.getByteFrequencyData) 零跨域污染、实时提取频率驱动声波。

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
}

type FunctionContext = {
  request: Request
  env: Env
  params: { name?: string }
}

const ALLOWED_TRACKS = new Set([
  'lemonade.mp3',
  'mengxing.mp3',
  'luoshengmen.mp3',
])

export const onRequestGet = async ({
  env,
  params,
}: FunctionContext): Promise<Response> => {
  const name = typeof params.name === 'string' ? params.name : ''
  if (!ALLOWED_TRACKS.has(name)) {
    return new Response('Track not found', { status: 404 })
  }

  if (!env.MLIN_R2) {
    return new Response('R2 bucket MLIN_R2 is not bound yet', { status: 503 })
  }

  const obj = await env.MLIN_R2.get(name)
  if (!obj) {
    return new Response(`Track ${name} not uploaded to R2 yet`, { status: 404 })
  }

  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType || 'audio/mpeg')
  headers.set('Content-Length', String(obj.size))
  headers.set('Cache-Control', 'public, max-age=86400')
  headers.set('Access-Control-Allow-Origin', '*')
  if (obj.httpEtag) headers.set('ETag', obj.httpEtag)

  return new Response(obj.body, {
    status: 200,
    headers,
  })
}
