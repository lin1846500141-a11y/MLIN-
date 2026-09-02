'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { capabilityNotes } from '@/lib/archive-data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const archiveLetters = 'ARCHIVE'.split('')

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
  const introTimeline = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>('.hero-stage')
    if (!stage) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reduceMotion || !finePointer) return

    let frame = 0
    const updateParallax = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = stage.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5

        stage.style.setProperty('--hero-back-x', `${x * -8}px`)
        stage.style.setProperty('--hero-back-y', `${y * -5}px`)
        stage.style.setProperty('--hero-front-x', `${x * 15}px`)
        stage.style.setProperty('--hero-front-y', `${y * 9}px`)
      })
    }

    const resetParallax = () => {
      stage.style.setProperty('--hero-back-x', '0px')
      stage.style.setProperty('--hero-back-y', '0px')
      stage.style.setProperty('--hero-front-x', '0px')
      stage.style.setProperty('--hero-front-y', '0px')
    }

    stage.addEventListener('pointermove', updateParallax)
    stage.addEventListener('pointerleave', resetParallax)

    return () => {
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', updateParallax)
      stage.removeEventListener('pointerleave', resetParallax)
    }
  }, [])

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      const launchLetters = gsap.utils.toArray<HTMLElement>('.hero-launch-letter')
      const titleLetters = gsap.utils.toArray<HTMLElement>('.hero-title-letter')
      const shutters = gsap.utils.toArray<HTMLElement>('.hero-shutter')
      const launchOffsets = [64, -48, 78, -64, 54, -72, 42]
      const launchRotations = [-2.4, 1.8, -1.2, 2.1, -1.7, 1.4, -0.8]

      const markIntroComplete = () => {
        root.current?.setAttribute('data-intro', 'complete')
      }

      const intro = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: markIntroComplete,
      })
      introTimeline.current = intro

      launchLetters.forEach((letter, index) => {
        const landingAt = 0.12 + index * 0.22

        intro
          .fromTo(
            letter,
            {
              autoAlpha: 0,
              scale: 6.8 - index * 0.18,
              y: launchOffsets[index],
              rotationZ: launchRotations[index],
              z: 360,
              filter: 'blur(13px)',
            },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              rotationZ: 0,
              z: 0,
              filter: 'blur(0px)',
              duration: 0.72,
              ease: 'expo.out',
            },
            landingAt,
          )
          .to(
            shutters[index],
            { yPercent: -102, duration: 0.62, ease: 'power4.inOut' },
            landingAt + 0.3,
          )
          .to(titleLetters[index], { autoAlpha: 1, duration: 0.12 }, landingAt + 0.62)
          .to(letter, { autoAlpha: 0, duration: 0.14, ease: 'power2.out' }, landingAt + 0.68)
      })

      intro
        .to('.hero-scene-image', { scale: 1, duration: 1.1, ease: 'power3.out' }, 0.7)
        .fromTo(
          '.hero-chrome',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.045, ease: 'power3.out' },
          1.82,
        )
        .to('.hero-launch-skip', { autoAlpha: 0, duration: 0.2 }, 1.92)
        .set('.hero-shutters, .hero-launch-word', { autoAlpha: 0 }, 2.28)

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      heroTimeline
        .to('.hero-scene-image', { scale: 1.085, yPercent: 1.8, ease: 'none' }, 0)
        .to('.hero-foreground-image', { scale: 1.13, yPercent: 2.8, ease: 'none' }, 0)
        .to('.hero-title-final', { yPercent: -15, opacity: 0.18, ease: 'none' }, 0.08)
        .to('.hero-topbar, .hero-archive-label', { opacity: 0, y: -18, ease: 'none' }, 0.12)
        .to('.hero-index', { xPercent: 105, ease: 'power2.in' }, 0.42)
        .fromTo(
          '.hero-blue-wipe',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'bottom center', ease: 'power2.inOut' },
          0.7,
        )

      const skipIntro = (event: KeyboardEvent) => {
        if (event.key === 'Escape') intro.progress(1)
      }
      window.addEventListener('keydown', skipIntro)

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

      const progressCurrent = root.current?.querySelector<HTMLElement>('.home-progress-current')
      const progressSections = [
        { selector: '.manifesto-section', number: '02' },
        { selector: '.field-section', number: '03' },
        { selector: '.routes-section', number: '04' },
      ]

      gsap.fromTo(
        '.home-progress-rail',
        { autoAlpha: 0, x: 18 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap.fromTo(
        '.home-progress-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top bottom',
            endTrigger: '.routes-section',
            end: 'bottom 55%',
            scrub: 0.35,
          },
        },
      )

      gsap.to('.home-progress-rail', {
        autoAlpha: 0,
        y: -12,
        duration: 0.35,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.home-footer',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      })

      progressSections.forEach(({ selector, number }) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 56%',
          end: 'bottom 56%',
          onEnter: () => {
            if (progressCurrent) progressCurrent.textContent = number
          },
          onEnterBack: () => {
            if (progressCurrent) progressCurrent.textContent = number
          },
        })
      })

      return () => {
        window.removeEventListener('keydown', skipIntro)
        introTimeline.current = null
      }
    },
    { scope: root },
  )

  return (
    <main className="home" id="top" ref={root} data-intro="running">
      <section className="hero-scroll" ref={hero} aria-label="MLIN Wiki 海岸档案首页">
        <div className="hero-stage">
          <div className="hero-scene" aria-hidden="true">
            <div className="hero-scene-back">
              <Image
                className="hero-scene-image"
                src="/media/coastal-archive-hero-v2.webp"
                alt=""
                fill
                sizes="100vw"
                quality={90}
                priority
              />
            </div>
            <div className="hero-scene-foreground">
              <Image
                className="hero-foreground-image"
                src="/media/coastal-archive-hero-v2.webp"
                alt=""
                fill
                sizes="100vw"
                quality={90}
                priority
              />
            </div>
            <div className="hero-atmosphere" />
          </div>

          <h1 className="hero-title-final" aria-label="Archive">
            <span className="hero-word-scale">
              {archiveLetters.map((letter, index) => (
                <span className={`hero-title-letter hero-letter-${index + 1}`} aria-hidden="true" key={`${letter}-${index}`}>
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <div className="hero-grid" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          <header className="hero-topbar hero-chrome">
            <Link className="hero-brand" href="/" aria-label="MLINStudio 首页">MLINStudio</Link>
            <span className="hero-top-rule" aria-hidden="true"><i /></span>
          </header>

          <div className="hero-archive-label hero-chrome">
            <span>COASTAL SIGNAL ARCHIVE</span>
            <i />
          </div>

          <aside className="hero-index hero-chrome" aria-label="Coastal Signal Archive 索引">
            <div className="hero-index-name">COASTAL<br />SIGNAL<br />ARCHIVE</div>
            <div className="hero-index-count">
              <strong>01</strong><span>/04</span>
            </div>
            <div className="hero-index-track" aria-hidden="true"><i /></div>
            <div className="hero-index-coordinate">
              <span>35.2149° N</span>
              <span>139.3467° E</span>
            </div>
            <Link className="hero-index-project" href="/wiki">
              <span>FIELD NOTES</span>
              <b>/ 01</b>
            </Link>
            <a className="hero-index-scroll" href="#studio-position">
              <span>SCROLL<br />ARCHIVE</span>
              <b aria-hidden="true">↓</b>
            </a>
          </aside>

          <div className="hero-shutters" aria-hidden="true">
            {archiveLetters.map((letter, index) => (
              <span className={`hero-shutter hero-shutter-${index + 1}`} key={`${letter}-shutter-${index}`} />
            ))}
          </div>

          <div className="hero-launch-word" aria-hidden="true">
            <span className="hero-word-scale">
              {archiveLetters.map((letter, index) => (
                <span className={`hero-launch-letter hero-letter-${index + 1}`} key={`${letter}-launch-${index}`}>
                  {letter}
                </span>
              ))}
            </span>
          </div>

          <button
            className="hero-launch-skip"
            type="button"
            onClick={() => introTimeline.current?.progress(1)}
            aria-label="跳过首页启动动画"
          >
            SKIP INTRO <span>↗</span>
          </button>

          <noscript>
            <style>{`.hero-shutters,.hero-launch-word,.hero-launch-skip{display:none!important}.hero-title-letter,.hero-chrome{opacity:1!important;visibility:visible!important}`}</style>
          </noscript>

          <div className="sr-only">
            <p>MLINStudio Coastal Signal Archive.</p>
            <p>A personal archive of field notes, visual studies and quiet discoveries from the edges of land and sea.</p>
            <p>Coastal Study 01 of 04. Coordinates 35.2149 degrees north, 139.3467 degrees east.</p>
          </div>

          <div className="hero-blue-wipe" aria-hidden="true" />
        </div>
      </section>

      <aside className="home-progress-rail" aria-hidden="true">
        <span className="home-progress-kicker">FIELD INDEX</span>
        <div className="home-progress-value">
          <strong className="home-progress-current">02</strong>
          <span>/ 04</span>
        </div>
        <span className="home-progress-track">
          <i className="home-progress-fill" />
        </span>
        <span className="home-progress-caption">SCROLL<br />ARCHIVE</span>
      </aside>

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
