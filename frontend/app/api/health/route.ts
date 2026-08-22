import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const backend = process.env.BACKEND_API_URL?.replace(/\/$/, '')

  if (!backend) {
    return NextResponse.json({ status: 'ok', service: 'mlin-web', backend: 'not-configured' })
  }

  try {
    const response = await fetch(`${backend}/api/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    })

    if (!response.ok) throw new Error('Backend health check failed')

    return NextResponse.json({ status: 'ok', service: 'mlin-web', backend: 'ok' })
  } catch {
    return NextResponse.json(
      { status: 'degraded', service: 'mlin-web', backend: 'unavailable' },
      { status: 503 },
    )
  }
}
