'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/', label: 'Index' },
  { href: '/wiki', label: 'Wiki' },
  { href: '/guestbook', label: 'Guestbook' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <Link className="site-name" href="/" aria-label="MLIN Wiki 首页">
        <span>MLIN</span> Wiki
      </Link>

      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map((item) => (
          <Link
            href={item.href}
            className={pathname === item.href ? 'is-current' : ''}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-record">
        <i /> FIELD LOG · 2026
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? '关闭菜单' : '打开菜单'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'CLOSE' : 'MENU'}</span>
        <b>{open ? '×' : '+'}</b>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="移动端导航"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {navItems.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span>0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
