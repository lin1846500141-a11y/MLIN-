import { useApp } from './context/AppContext.jsx'
import { SECTION_LABELS } from './lib/config.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WikiView from './components/WikiView.jsx'
import GuestbookView from './components/GuestbookView.jsx'
import AboutView from './components/AboutView.jsx'

export default function App() {
  const { tab, reverse } = useApp()

  const viewClass = (id) =>
    ['view', tab === id ? 'active' : '', tab === id && reverse ? 'reverse' : '']
      .filter(Boolean)
      .join(' ')

  return (
    <div className="site-shell">
      <Header />
      <main className="view-container">
          <div className={viewClass('welcome')}>
            <Hero />
          </div>
          <div className={viewClass('wiki')}>
            <WikiView />
          </div>
          <div className={viewClass('guestbook')}>
            <GuestbookView />
          </div>
          <div className={`${viewClass('about')} about-view`}>
            <AboutView />
          </div>
      </main>
      {tab !== 'welcome' && tab !== 'about' && (
        <div className="section-label" key={tab}>{SECTION_LABELS[tab]}</div>
      )}
    </div>
  )
}
