import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { WikiGrid } from '@/components/wiki/wiki-grid'

export const metadata: Metadata = {
  title: 'Wiki Archive',
  description: 'MLIN Wiki 的技术、视觉与实践索引。',
}

export default function WikiPage() {
  return (
    <main className="inner-page wiki-page">
      <PageIntro
        index="01"
        eyebrow="OPEN ARCHIVE"
        title={<>WIKI<br /><i>INDEX</i></>}
        description="这不是百科全书，而是一组仍在增加的个人索引。可以按标签浏览，也可以直接搜索。"
        aside="VISUAL / MOTION / MACHINE / RESEARCH"
      />
      <WikiGrid />
      <footer className="inner-footer"><span>END OF CURRENT INDEX</span><b>MLINStudio</b></footer>
    </main>
  )
}
