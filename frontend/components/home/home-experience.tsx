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

      gsap.from('.hero-title-letter', {
        yPercent: 112,
        duration: 1.25,
        stagger: 0.055,
        ease: 'power4.out',
        delay: 0.1,
      })
      gsap.from('.hero-intro-item', {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.65,
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
        .to('.hero-photo', { scale: 1.13, yPercent: 4, ease: 'none' }, 0)
        .to('.hero-title', { yPercent: -42, letterSpacing: '-0.055em', ease: 'none' }, 0)
        .to('.hero-rail-content', { yPercent: 24, ease: 'none' }, 0)
        .to('.hero-intro-copy, .hero-scroll-cue', { opacity: 0, y: -30, ease: 'none' }, 0.12)
        .fromTo(
          '.hero-blue-wipe',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'bottom center', ease: 'power2.inOut' },
          0.7,
        )
        .to('.hero-title, .hero-rail', { opacity: 0, ease: 'none' }, 0.88)

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
          <div className="hero-photo">
            <Image
              src="/media/coastal-hero.webp"
              alt="夏日海岸小镇、海面与沿海电车"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 84vw"
            />
          </div>

          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-sky-mark hero-intro-item">N 22° 16′ / E 113° 34′</div>

          <div className="hero-title" aria-label="Archive">
            {'ARCHIVE'.split('').map((letter, index) => (
              <span className="hero-title-mask" key={`${letter}-${index}`}>
                <b className="hero-title-letter">{letter}</b>
              </span>
            ))}
          </div>

          <div className="hero-intro-copy">
            <span className="hero-intro-item">COASTAL DIGITAL ARCHIVE</span>
            <p className="hero-intro-item">界面、机器与持续发生的实践记录。</p>
          </div>

          <div className="hero-index hero-intro-item">
            <span>ISSUE</span>
            <b>01</b>
            <i>/ 04</i>
          </div>

          <aside className="hero-rail">
            <div className="hero-rail-content">
              <div className="rail-topline">
                <span>COASTAL STUDY</span>
                <b>01 / 04</b>
              </div>
              <div className="rail-map" aria-hidden="true">
                <svg viewBox="0 0 180 250" role="presentation">
                  <path d="M26 8c39 26 13 49 46 70 25 16 67 4 73 35 7 35-48 39-54 74-4 22 19 39 55 55" />
                  <path d="M52 38c19 15 22 33 45 41 25 8 51-3 57 21" />
                  <circle cx="91" cy="187" r="5" />
                  <line x1="91" y1="170" x2="91" y2="204" />
                  <line x1="74" y1="187" x2="108" y2="187" />
                </svg>
              </div>
              <div className="rail-location">
                <span>FIELD LOCATION</span>
                <strong>SEA / CITY</strong>
                <small>BLUE HOUR 08:42</small>
              </div>
              <Link className="rail-link" href="/wiki">
                VIEW INDEX <span>↗</span>
              </Link>
              <div className="rail-vertical">FIELD NOTES · MLIN WIKI</div>
            </div>
          </aside>

          <div className="hero-signature hero-intro-item">MLINStudio</div>
          <div className="hero-scroll-cue hero-intro-item">
            <span />
            SCROLL TO MOVE FORWARD
            <b>↓</b>
          </div>
          <Crosshair className="hero-crosshair" />
          <div className="hero-blue-wipe" aria-hidden="true" />
        </div>
      </section>

      <section className="manifesto-section">
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
