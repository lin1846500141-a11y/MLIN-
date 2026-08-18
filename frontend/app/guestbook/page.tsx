import type { Metadata } from 'next'
import { GuestbookBoard } from '@/components/guestbook/guestbook-board'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = {
  title: 'Guestbook',
  description: '经过 MLIN Wiki 时，留下一条坐标。',
}

export default function GuestbookPage() {
  return (
    <main className="inner-page guestbook-page">
      <PageIntro
        index="02"
        eyebrow="OPEN CHANNEL"
        title={<>GUEST<br /><i>BOOK</i></>}
        description="一块开放的信号板。每一条留言，都是在这份档案上短暂停留的坐标。"
        aside="CHANNEL STATUS / PUBLIC"
      />
      <GuestbookBoard />
      <footer className="inner-footer"><span>END OF RECEIVED SIGNALS</span><b>MLINStudio</b></footer>
    </main>
  )
}
