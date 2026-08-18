import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import 'lenis/dist/lenis.css'
import { SmoothScrollProvider } from '@/components/motion/smooth-scroll-provider'
import { SiteHeader } from '@/components/site/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MLIN Wiki — Coastal Digital Archive',
    template: '%s — MLIN Wiki',
  },
  description: 'MLINStudio 的个人数字档案：界面、机器、实践与持续更新的记录。',
  keywords: ['MLIN Wiki', 'MLINStudio', 'portfolio', 'digital archive', 'web design'],
  openGraph: {
    title: 'MLIN Wiki — Coastal Digital Archive',
    description: '界面、机器、实践与持续更新的记录。',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#eef5f7',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SmoothScrollProvider>
          <SiteHeader />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
