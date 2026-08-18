'use client'

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
    })

    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    ScrollTrigger.refresh()
  }, [pathname])

  return children
}
