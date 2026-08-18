import { NextResponse } from 'next/server'
import { wikiFallback } from '@/lib/archive-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const backend = process.env.BACKEND_API_URL?.replace(/\/$/, '')
  if (backend) {
    try {
      const response = await fetch(`${backend}/api/wiki`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(4500),
      })
      if (response.ok) return NextResponse.json(await response.json())
    } catch {
      // The local archive keeps the page useful while the API wakes up.
    }
  }

  return NextResponse.json(wikiFallback, {
    headers: { 'x-mlin-source': 'local-fallback' },
  })
}
