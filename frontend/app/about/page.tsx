import type { Metadata } from 'next'
import Image from 'next/image'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = {
  title: 'About',
  description: '关于 MLINStudio：硬件、设备与 AI 开发实践。',
}

const skills = [
  ['01', 'PC HARDWARE', '电脑配置 / 台式机组装', '根据用途搭配硬件，完成整机装配。'],
  ['02', 'SMT EQUIPMENT', '贴片机操作', '松下、西门子、富士贴片机。'],
  ['03', 'DIE BONDER', '固晶机操作', '新益昌固晶机。'],
  ['04', 'AI DEVELOPMENT', 'AI 开发', '持续学习，把想法做成可以运行的作品。'],
]

export default function AboutPage() {
  return (
    <main className="inner-page about-page">
      <PageIntro
        index="03"
        eyebrow="PERSONNEL FILE"
        title={<>ABOUT<br /><i>MLIN</i></>}
        description="会配电脑，也会操作生产线设备。现在正把对机器的理解，慢慢延伸到 AI 与界面开发。"
        aside="GUANGDONG / CHINA"
      />

      <section className="about-portrait" aria-label="个人简介">
        <div className="about-photo">
          <Image src="/media/coastal-hero.webp" alt="沿海小镇与蓝色海面" fill sizes="60vw" />
          <span>PLACE / SOUTH COAST</span>
          <b>22.16° N</b>
        </div>
        <div className="about-statement">
          <span>PROFILE / 001</span>
          <h2>OPERATOR.<br />BUILDER.<br /><i>AI CURIOUS.</i></h2>
          <p>
            这里记录的不是一个已经完成的身份，而是几条正在交汇的路线：实体设备、电脑硬件、AI 开发与视觉表达。
          </p>
        </div>
      </section>

      <section className="capability-section">
        <header><span>01 — CAPABILITIES</span><h2>WHAT I CAN DO</h2><b>技能档案</b></header>
        <div className="capability-list">
          {skills.map(([number, label, title, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <b>{label}</b>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section">
        <header><span>02 — WORK HISTORY</span><h2>EXPERIENCE</h2><b>工作经历</b></header>
        <article>
          <time>2025.08 — 2026.05</time>
          <div><h3>广东晶科电子有限公司</h3><p>GUANGDONG JINGKE ELECTRONICS CO., LTD.</p></div>
          <strong>01</strong>
        </article>
      </section>

      <footer className="inner-footer"><span>RECORD TO BE CONTINUED</span><b>MLINStudio</b></footer>
    </main>
  )
}
