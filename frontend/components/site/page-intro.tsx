import Link from 'next/link'
import type { ReactNode } from 'react'

type PageIntroProps = {
  index: string
  eyebrow: string
  title: ReactNode
  description: string
  aside: string
}

export function PageIntro({ index, eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div className="page-intro-meta">
        <span>{index} — {eyebrow}</span>
        <Link href="/">RETURN TO INDEX ↖</Link>
      </div>
      <div className="page-intro-title">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>{aside}</span>
      </div>
    </header>
  )
}
