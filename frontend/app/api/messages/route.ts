import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function backendUrl() {
  const configured = process.env.BACKEND_API_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:8000'
  return null
}

export async function GET() {
  const backend = backendUrl()
  if (!backend) return NextResponse.json({ error: 'Message service is not configured' }, { status: 503 })

  try {
    const response = await fetch(`${backend}/api/messages`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) throw new Error('Backend error')
    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ error: 'Message service unavailable' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  const backend = backendUrl()
  if (!backend) return NextResponse.json({ error: 'Message service is not configured' }, { status: 503 })

  let payload: { name?: string; message?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = payload.name?.trim()
  const message = payload.message?.trim()
  if (!name || !message || name.length > 20 || message.length > 200) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  try {
    const response = await fetch(`${backend}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) throw new Error('Backend error')
    return NextResponse.json(await response.json(), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Message service unavailable' }, { status: 503 })
  }
}
