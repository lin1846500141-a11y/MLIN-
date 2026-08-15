import { useEffect, useMemo, useRef, useState } from 'react'

const galleryImages = Array.from({ length: 10 }, (_, index) =>
  `/about-gallery/${String(index + 1).padStart(2, '0')}.jpg`,
)

const makeQueue = (exclude) => {
  const queue = galleryImages.map((_, index) => index).filter((index) => index !== exclude)
  for (let index = queue.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[queue[index], queue[swap]] = [queue[swap], queue[index]]
  }
  return queue
}

function AboutGallery() {
  const initial = useMemo(() => Math.floor(Math.random() * galleryImages.length), [])
  const [layers, setLayers] = useState([initial, initial])
  const [activeLayer, setActiveLayer] = useState(0)
  const activeRef = useRef(0)
  const currentRef = useRef(initial)
  const queueRef = useRef(makeQueue(initial))

  useEffect(() => {
    let cancelled = false
    let timer = 0
    let revealTimer = 0

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!queueRef.current.length) queueRef.current = makeQueue(currentRef.current)
        const next = queueRef.current.shift()
        const loader = new Image()
        loader.src = galleryImages[next]
        loader.onload = () => {
          if (cancelled) return
          const inactive = activeRef.current === 0 ? 1 : 0
          setLayers((previous) => previous.map((value, index) => (index === inactive ? next : value)))
          revealTimer = window.setTimeout(() => {
            if (cancelled) return
            activeRef.current = inactive
            currentRef.current = next
            setActiveLayer(inactive)
            schedule()
          }, 80)
        }
        loader.onerror = schedule
      }, 7600)
    }

    schedule()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.clearTimeout(revealTimer)
    }
  }, [])

  return (
    <div className="about-gallery" aria-hidden="true">
      {layers.map((imageIndex, layerIndex) => (
        <div
          className={`about-gallery-layer${activeLayer === layerIndex ? ' is-active' : ''}`}
          key={layerIndex}
        >
          <img className="about-gallery-fill" src={galleryImages[imageIndex]} alt="" />
          <img className="about-gallery-frame" src={galleryImages[imageIndex]} alt="" />
        </div>
      ))}
      <div className="about-gallery-veil" />
      <div className="about-gallery-grain" />
      <div className="about-gallery-status">
        <span>PRIVATE VISUAL ARCHIVE</span>
        <b>{String(layers[activeLayer] + 1).padStart(2, '0')} / 10</b>
      </div>
    </div>
  )
}

const skills = [
  {
    number: '01',
    label: 'PC HARDWARE',
    title: '电脑配置 / 台式机组装',
    detail: '根据用途搭配硬件，完成整机装配。',
  },
  {
    number: '02',
    label: 'SMT EQUIPMENT',
    title: '贴片机操作',
    detail: '松下、西门子、富士贴片机。',
  },
  {
    number: '03',
    label: 'DIE BONDER',
    title: '固晶机操作',
    detail: '新益昌固晶机。',
  },
  {
    number: '04',
    label: 'AI DEVELOPMENT',
    title: 'AI 开发',
    detail: '略懂，持续学习与实践中。',
  },
]

export default function AboutView() {
  return (
    <article className="about-profile">
      <AboutGallery />

      <div className="about-profile-content">
      <header className="about-profile-meta about-reveal">
        <span>05 — PERSONNEL FILE</span>
        <span>GUANGDONG / CHINA</span>
      </header>

      <section className="about-profile-hero">
        <div className="about-profile-title about-reveal">
          <span>ABOUT</span>
          <strong>ME<i>.</i></strong>
        </div>
        <div className="about-profile-intro about-reveal">
          <span>OPERATOR / BUILDER / AI CURIOUS</span>
          <p>会配电脑，也会操作生产线设备。正在把对机器的理解，慢慢延伸到 AI 开发。</p>
        </div>
      </section>

      <section className="about-capabilities">
        <div className="about-section-heading about-reveal">
          <span>01</span>
          <h3>WHAT I CAN DO</h3>
          <em>技能档案</em>
        </div>

        <div className="about-skill-list">
          {skills.map((skill, index) => (
            <div className="about-skill about-reveal" style={{ '--delay': `${160 + index * 80}ms` }} key={skill.number}>
              <span className="about-skill-number">{skill.number}</span>
              <span className="about-skill-label">{skill.label}</span>
              <h4>{skill.title}</h4>
              <p>{skill.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-experience">
        <div className="about-section-heading about-reveal">
          <span>02</span>
          <h3>WORK HISTORY</h3>
          <em>工作经历</em>
        </div>

        <div className="about-job about-reveal">
          <time>2025.08 — 2026.05</time>
          <h4>广东晶科电子有限公司</h4>
          <span>GUANGDONG JINGKE ELECTRONICS CO., LTD.</span>
          <i>01</i>
        </div>
      </section>

      <footer className="about-profile-footer about-reveal">
        <span>END OF CURRENT RECORD</span>
        <span>TO BE CONTINUED.</span>
      </footer>
      </div>
    </article>
  )
}
