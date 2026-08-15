import { useEffect, useRef, useState } from 'react'

const VIDEO_START = 6
const VIDEO_END = 16
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const layers = [
  { text: 'PLAYER.', start: 0.08, direction: -1 },
  { text: 'COLLECTOR.', start: 0.3, direction: 1 },
  { text: 'CREATOR.', start: 0.53, direction: -1 },
  { text: 'THIS IS ME.', start: 0.75, direction: 1 },
]

export default function VideoAbout({ onEnterAbout }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const frameRef = useRef(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined

    const textLayers = Array.from(section.querySelectorAll('[data-video-layer]'))
    let running = false
    let queuedTime = VIDEO_START

    const commitSeek = () => {
      if (!running || video.seeking || video.readyState < 2) return
      if (Math.abs(video.currentTime - queuedTime) > 0.025) video.currentTime = queuedTime
    }

    const updateLoadProgress = () => {
      if (!Number.isFinite(video.duration) || !video.duration) return
      let bufferedEnd = 0
      for (let index = 0; index < video.buffered.length; index += 1) {
        bufferedEnd = Math.max(bufferedEnd, video.buffered.end(index))
      }
      const segmentProgress = clamp((bufferedEnd - VIDEO_START) / (VIDEO_END - VIDEO_START))
      setLoadProgress(Math.round(segmentProgress * 100))
    }

    const primeVideo = () => {
      video.currentTime = Math.min(VIDEO_START, Math.max(0, video.duration - 0.1))
      setLoadProgress((value) => Math.max(value, 12))
    }

    const markReady = () => {
      updateLoadProgress()
      setLoadProgress(100)
      setReady(true)
    }

    const readScroll = () => {
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      targetProgressRef.current = clamp(-rect.top / distance)
    }

    const draw = () => {
      if (!running) return
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const next = current + (target - current) * 0.1
      currentProgressRef.current = Math.abs(target - next) < 0.0005 ? target : next

      const progress = currentProgressRef.current
      const targetTime = VIDEO_START + progress * (VIDEO_END - VIDEO_START)
      section.style.setProperty('--video-progress', String(progress))
      queuedTime = targetTime
      commitSeek()

      textLayers.forEach((layer) => {
        const start = Number(layer.dataset.start)
        const direction = Number(layer.dataset.direction)
        const reveal = clamp((progress - start) / 0.14)
        const retire = clamp((progress - (start + 0.28)) / 0.18)
        const opacity = reveal * (1 - retire * 0.62)
        layer.style.opacity = String(opacity)
        layer.style.transform = `translate3d(${(1 - reveal) * direction * 22}vw, ${retire * -3}vh, 0) scale(${0.93 + reveal * 0.07})`
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
      { rootMargin: '40% 0px' },
    )

    video.addEventListener('loadedmetadata', primeVideo)
    video.addEventListener('progress', updateLoadProgress)
    video.addEventListener('canplay', markReady, { once: true })
    video.addEventListener('seeked', commitSeek)
    if (video.readyState >= 1) primeVideo()
    if (video.readyState >= 3) markReady()

    readScroll()
    observer.observe(section)
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)

    return () => {
      running = false
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
      video.removeEventListener('loadedmetadata', primeVideo)
      video.removeEventListener('progress', updateLoadProgress)
      video.removeEventListener('canplay', markReady)
      video.removeEventListener('seeked', commitSeek)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [])

  return (
    <section id="about-transition" className={`video-about${ready ? ' is-ready' : ''}`} ref={sectionRef}>
      <div className="video-about-sticky">
        <video
          ref={videoRef}
          className="video-about-media"
          src="/media/about-transition.mp4"
          preload="auto"
          muted
          playsInline
          aria-label="Gameplay transition from second 6 to second 16"
        />
        <div className="video-about-shade" />
        <div className="video-about-noise" />

        <div className="video-about-index">
          <span>04 — PERSONAL LOG</span>
          <span>06.00 — 16.00</span>
        </div>

        <div className="video-about-copy" aria-hidden="true">
          {layers.map((layer) => (
            <div
              className="video-about-layer"
              data-video-layer
              data-start={layer.start}
              data-direction={layer.direction}
              key={layer.text}
            >
              {layer.text}
            </div>
          ))}
        </div>

        <div className="video-about-timeline"><i /></div>
        <div className="video-about-time">06 <span>/</span> 16 SEC</div>

        <button className="video-about-enter" onClick={onEnterAbout}>
          ENTER ABOUT ME <span>↗</span>
        </button>

        <div className="video-preloader" role="status" aria-live="polite">
          <span>LOADING PERSONAL LOG</span>
          <div><i style={{ width: `${loadProgress}%` }} /></div>
          <b>{String(loadProgress).padStart(2, '0')}%</b>
        </div>
      </div>
    </section>
  )
}
