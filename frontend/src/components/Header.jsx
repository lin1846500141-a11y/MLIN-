import { useApp } from '../context/AppContext.jsx'
import { TABS } from '../lib/config.js'

export default function Header() {
  const { tab, switchTab, apiOnline } = useApp()

  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => switchTab('welcome')}>
        Miku Digital Archive
      </button>

      <nav className="tabs" aria-label="Primary navigation">
        {TABS.filter((t) => t.id !== 'welcome').map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => switchTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            {t.nav}
          </button>
        ))}
      </nav>

      <div className="header-meta">
        <span
          className={`status-dot ${apiOnline ? 'online' : 'offline'}`}
          title={apiOnline ? '后端已连接' : '后端离线(使用本地数据)'}
        />
        <span>{apiOnline ? 'ONLINE' : 'LOCAL'}</span>
        <button className="arrow-home" onClick={() => switchTab('welcome')} aria-label="Back home">→</button>
      </div>
    </header>
  )
}
