export const TABS = [
  { id: 'welcome', nav: 'Welcome' },
  { id: 'wiki', nav: 'Wiki' },
  { id: 'guestbook', nav: 'Guestbook' },
  { id: 'about', nav: 'About' },
]

// 顺序用于判断切换方向(前进/后退 → 滑动动画)
export const TAB_ORDER = TABS.map((t) => t.id)

// 左下角 HUD 标号
export const SECTION_LABELS = {
  welcome: '01 — HOME',
  wiki: '02 — ARCHIVE',
  guestbook: '03 — GUESTBOOK',
  about: '04 — ABOUT',
}
