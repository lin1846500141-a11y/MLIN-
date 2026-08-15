import { useEffect, useRef } from 'react'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export default function WeaponStory({ onContinue }) {
  const sectionRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const lines = Array.from(section.querySelectorAll('[data-story-line]'))
    let running = false

    const readScroll = () => {
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      targetRef.current = clamp(-rect.top / distance)
    }

    const draw = () => {
      if (!running) return
      const current = currentRef.current
      const target = targetRef.current
      const next = current + (target - current) * 0.09
      currentRef.current = Math.abs(target - next) < 0.0005 ? target : next

      const progress = currentRef.current
      const eased = 1 - Math.pow(1 - progress, 3)
      section.style.setProperty('--story-progress', String(progress))
      section.style.setProperty('--story-turn', `${-78 * (1 - eased)}deg`)
      section.style.setProperty('--story-slide', `${30 * (1 - eased)}vw`)
      section.style.setProperty('--story-scale', String(0.72 + eased * 0.28))
      const backOne = clamp((progress - 0.2) / 0.22)
      const backTwo = clamp((progress - 0.48) / 0.22)
      section.style.setProperty('--story-back-one', String(backOne))
      section.style.setProperty('--story-back-two', String(backTwo))
      section.style.setProperty('--story-back-one-slide', `${(1 - backOne) * -18}vw`)
      section.style.setProperty('--story-back-two-slide', `${(1 - backTwo) * 20}vw`)

      lines.forEach((line) => {
        const start = Number(line.dataset.start)
        const reveal = clamp((progress - start) / 0.18)
        const direction = Number(line.dataset.direction || 1)
        line.style.opacity = String(reveal)
        line.style.transform = `translate3d(${(1 - reveal) * direction * 120}px, 0, 0)`
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running) {
          readScroll()
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(draw)
        } else {
          cancelAnimationFrame(frameRef.current)
        }
      },
      { rootMargin: '30% 0px' },
    )

    readScroll()
    observer.observe(section)
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)

    return () => {
      running = false
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [])

  const onPointerMove = (event) => {
    const section = sectionRef.current
    if (!section || event.pointerType === 'touch') return
    const rect = section.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    section.style.setProperty('--story-mouse-x', `${x * 4}deg`)
    section.style.setProperty('--story-mouse-y', `${y * -3}deg`)
  }

  const resetPointer = () => {
    sectionRef.current?.style.setProperty('--story-mouse-x', '0deg')
    sectionRef.current?.style.setProperty('--story-mouse-y', '0deg')
  }

  return (
    <section
      className="weapon-story"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="story-sticky">
        <div className="story-grid" />
        <div className="story-index">03 — ABOUT THE COLLECTION</div>
        <div className="story-progress"><i /></div>

        <div className="story-weapon story-weapon-back-one">
          <img src="/weapons/weapon-03.png" alt="" loading="lazy" />
        </div>
        <div className="story-weapon story-weapon-back-two">
          <img src="/weapons/weapon-05.png" alt="" loading="lazy" />
        </div>
        <div className="story-weapon story-weapon-main">
          <img src="/weapons/weapon-04.png" alt="Pink TRU weapon rotating into view" loading="lazy" />
        </div>

        <div className="story-line story-line-one" data-story-line data-start="0.08" data-direction="-1">
          BUILT FROM
        </div>
        <div className="story-line story-line-two" data-story-line data-start="0.34" data-direction="1">
          MUSIC, GAMES
        </div>
        <div className="story-line story-line-three" data-story-line data-start="0.6" data-direction="-1">
          AND OBSESSION.
        </div>

        <button className="story-about-link" onClick={onContinue}>CONTINUE TO ABOUT <span>↓</span></button>
      </div>
    </section>
  )
}
