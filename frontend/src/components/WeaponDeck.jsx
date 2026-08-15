import { useEffect, useRef, useState } from 'react'

const WEAPONS = [
  { image: '/weapons/weapon-01.png', name: 'Spectrum / Frost' },
  { image: '/weapons/weapon-02.png', name: 'Spectrum / Rose' },
  { image: '/weapons/weapon-03.png', name: 'Skyline / Sakura' },
  { image: '/weapons/weapon-04.png', name: 'TRU / Blush' },
  { image: '/weapons/weapon-05.png', name: 'Solar / Gold' },
  { image: '/weapons/weapon-06.png', name: 'Lunar / Violet' },
]

export default function WeaponDeck({ onExplore }) {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const frameRef = useRef(0)

  const slotFor = (index) => {
    const forward = (index - active + WEAPONS.length) % WEAPONS.length
    const backward = (active - index + WEAPONS.length) % WEAPONS.length
    if (index === active) return 'active'
    if (forward === 1) return 'next'
    if (backward === 1) return 'prev'
    return 'hidden'
  }

  const onPointerMove = (event) => {
    const section = sectionRef.current
    if (!section || event.pointerType === 'touch') return
    const rect = section.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      section.style.setProperty('--deck-x', x.toFixed(3))
      section.style.setProperty('--deck-y', y.toFixed(3))
    })
  }

  const resetPointer = () => {
    sectionRef.current?.style.setProperty('--deck-x', 0)
    sectionRef.current?.style.setProperty('--deck-y', 0)
  }

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  return (
    <section
      className="weapon-section"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="weapon-glow" />
      <div className="weapon-grid" />

      <div className="weapon-copy">
        <div className="weapon-index">02 — LOADOUT ARCHIVE</div>
        <h2>SIX FORMS.<br />ONE SIGNAL.</h2>
        <p>
          A floating collection of custom weapons. Move the cursor to shift depth,
          then select a number to bring another card forward.
        </p>
        <button onClick={onExplore}>OPEN COLLECTION <span>↗</span></button>
      </div>

      <div className="weapon-scene">
        <div className="weapon-orbit" />
        <div className="weapon-serial">CV<br />01</div>

        {WEAPONS.map((weapon, index) => (
          <article className="weapon-card" data-slot={slotFor(index)} key={weapon.image}>
            <img src={weapon.image} alt={weapon.name} loading={index > 1 ? 'lazy' : 'eager'} />
            <div className="weapon-card-label">
              <span>WPN — {String(index + 1).padStart(2, '0')}</span>
              <span>{weapon.name}</span>
            </div>
          </article>
        ))}

        <div className="weapon-selectors" aria-label="Choose weapon card">
          {WEAPONS.map((weapon, index) => (
            <button
              key={weapon.image}
              onClick={() => setActive(index)}
              aria-label={`Show ${weapon.name}`}
              aria-pressed={active === index}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div className="weapon-hint">MOVE CURSOR / SELECT CARD</div>
    </section>
  )
}
