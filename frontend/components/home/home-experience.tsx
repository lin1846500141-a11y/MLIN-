'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { capabilityNotes } from '@/lib/archive-data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const routeLinks = [
  {
    no: '01',
    href: '/wiki',
    title: 'WIKI',
    zh: '索引与笔记',
    desc: '持续整理的技术、视觉与实践记录。',
  },
  {
    no: '02',
    href: '/guestbook',
    title: 'GUESTBOOK',
    zh: '留下坐标',
    desc: '一块开放的留言区域，记录偶然经过的人。',
  },
  {
    no: '03',
    href: '/about',
    title: 'ABOUT',
    zh: '个人档案',
    desc: '关于经历、能力，以及正在学习的方向。',
  },
]

function Crosshair({ className = '' }: { className?: string }) {
  return (
    <span className={`crosshair ${className}`} aria-hidden="true">
      <i />
    </span>
  )
}

export function HomeExperience() {
  const root = useRef<HTMLElement>(null)
  const hero = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      gsap.from('.hero-master-image', {
        opacity: 0,
        duration: 1.35,
        ease: 'power3.out',
      })
      gsap.from('.hero-mobile-intro', {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.35,
      })

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      heroTimeline
        .to('.hero-master-image', { scale: 1.055, yPercent: 1.8, ease: 'none' }, 0)
        .to('.hero-mobile-title', { yPercent: -34, ease: 'none' }, 0)
        .to('.hero-mobile-rail', { yPercent: 16, ease: 'none' }, 0)
        .to('.hero-mobile-copy, .hero-mobile-scroll', { opacity: 0, y: -24, ease: 'none' }, 0.12)
        .fromTo(
          '.hero-blue-wipe',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'bottom center', ease: 'power2.inOut' },
          0.7,
        )
        .to('.hero-master, .hero-mobile', { opacity: 0, ease: 'none' }, 0.88)

      gsap.from('.manifesto-line span', {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.manifesto-copy',
          start: 'top 72%',
        },
      })

      gsap.utils.toArray<HTMLElement>('.field-plate').forEach((plate, index) => {
        gsap.from(plate, {
          y: 90,
          opacity: 0,
          rotate: index % 2 === 0 ? -1.2 : 1.2,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: plate,
            start: 'top 88%',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.route-row').forEach((row) => {
        gsap.from(row, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: row, start: 'top 90%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <main className="home" id="top" ref={root}>
      <section className="hero-scroll" ref={hero} aria-label="MLIN Wiki 海岸档案首页">
        <div className="hero-stage">
          <picture className="hero-master" aria-hidden="true">
            <source media="(max-width: 760px)" srcSet="/media/coastal-hero.webp" />
            <img
              className="hero-master-image"
              src="/media/coastal-archive-hero.jpg"
              alt=""
              width="1536"
              height="864"
              fetchPriority="high"
            />
          </picture>

          <nav className="hero-hotspots" aria-label="首页快捷入口">
            <Link className="hero-hotspot hero-brand-hotspot" href="/" aria-label="MLIN Wiki 首页" />
            <Link className="hero-hotspot hero-project-hotspot" href="/wiki" aria-label="查看 MLIN Wiki 项目" />
            <a className="hero-hotspot hero-scroll-hotspot" href="#studio-position" aria-label="向下滚动浏览" />
          </nav>

          <div className="hero-mobile">
            <div className="hero-mobile-rule hero-mobile-intro" aria-hidden="true"><i /></div>
            <Link className="hero-mobile-brand hero-mobile-intro" href="/">MLIN Wiki</Link>
            <div className="hero-mobile-title hero-mobile-intro" aria-label="Archive">ARCHIVE</div>
            <div className="hero-mobile-copy hero-mobile-intro">
              <span>COASTAL EDITORIAL ARCHIVE</span>
              <p>Field notes, visual studies and quiet discoveries from the edges of land and sea.</p>
            </div>
            <div className="hero-mobile-rail">
              <div className="hero-mobile-rail-head hero-mobile-intro">
                <span>COASTAL STUDY</span>
                <b>01 <i>/ 04</i></b>
              </div>
              <div className="hero-mobile-coordinate hero-mobile-intro">
                <span>35.2149° N</span>
                <span>139.3467° E</span>
              </div>
              <Link className="hero-mobile-project hero-mobile-intro" href="/wiki">VIEW PROJECT ↗</Link>
            </div>
            <div className="hero-mobile-signature hero-mobile-intro">MLINStudio</div>
            <a className="hero-mobile-scroll hero-mobile-intro" href="#studio-position">
              <span>SCROLL TO<br />MOVE FORWARD</span>
              <b>↓</b>
            </a>
          </div>

          <div className="sr-only">
            <h1>MLIN Wiki — Coastal Editorial Archive</h1>
            <p>Field notes, visual studies and quiet discoveries from the edges of land and sea.</p>
            <p>Coastal Study 01 of 04. Coordinates 35.2149 degrees north, 139.3467 degrees east.</p>
            <p>MLINStudio</p>
          </div>
          <div className="hero-blue-wipe" aria-hidden="true" />
        </div>
      </section>

      <section className="manifesto-section" id="studio-position">
        <div className="manifesto-meta">
          <span>02 — STUDIO POSITION</span>
          <span>BUILD / OBSERVE / RECORD</span>
          <span>UPDATED 2026</span>
        </div>

        <div className="manifesto-copy">
          <p className="manifesto-kicker">A PERSONAL INDEX BETWEEN</p>
          <h2>
            <span className="manifesto-line"><span>SIGNAL</span></span>
            <span className="manifesto-line"><span>&amp; SEA.</span></span>
          </h2>
          <div className="manifesto-note">
            <Crosshair />
            <p>
              不是一个静止的作品集，而是一份可以滚动、检索、继续补写的个人档案。
              蓝色来自夏天和海面，网格则负责把自由的内容重新归档。
            </p>
          </div>
        </div>
        <div className="manifesto-current">CURRENT / 001</div>
      </section>

      <section className="field-section" aria-labelledby="field-heading">
        <header className="field-header">
          <div>
            <span>03 — SELECTED FIELDS</span>
            <p>THREE WAYS OF MAKING</p>
          </div>
          <h2 id="field-heading">FIELD NOTES</h2>
          <Crosshair />
        </header>

        <div className="field-plates">
          {capabilityNotes.map((note, index) => (
            <motion.article
              className={`field-plate plate-${index + 1}`}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              key={note.no}
            >
              {index === 0 && (
                <div className="plate-photo" aria-hidden="true">
                  <Image src="/media/coastal-hero.webp" alt="" fill sizes="42vw" />
                </div>
              )}
              {index === 2 && <div className="plate-sun" aria-hidden="true" />}
              <div className="plate-topline">
                <span>{note.kicker}</span>
                <b>{note.no}</b>
              </div>
              <h3>{note.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
              <p>{note.body}</p>
              <footer>
                <span>{note.meta}</span>
                <Crosshair />
              </footer>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="routes-section" aria-labelledby="routes-heading">
        <div className="routes-heading">
          <span>04 — CONTINUE READING</span>
          <h2 id="routes-heading">OPEN THE ARCHIVE</h2>
          <p>选择一个入口，继续向内浏览。</p>
        </div>

        <div className="route-list">
          {routeLinks.map((item) => (
            <Link className="route-row" href={item.href} key={item.href}>
              <span className="route-no">{item.no}</span>
              <div className="route-title">
                <strong>{item.title}</strong>
                <i>{item.zh}</i>
              </div>
              <p>{item.desc}</p>
              <b className="route-arrow">↗</b>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <span>MLIN WIKI / DIGITAL FIELD LOG</span>
          <span>MADE IN GUANGDONG · CHINA</span>
        </div>
        <p>MLINStudio</p>
        <div>
          <span>COASTAL EDITION 01</span>
          <Link href="#top">BACK TO TOP ↑</Link>
        </div>
      </footer>
    </main>
  )
}
