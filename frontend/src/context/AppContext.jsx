import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { fetchWiki } from '../lib/api.js'
import { TAB_ORDER } from '../lib/config.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('miku_theme') || 'dark')
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem('miku_tab')
    return saved && TAB_ORDER.includes(saved) ? saved : 'welcome'
  })
  const [reverse, setReverse] = useState(false)
  const [apiOnline, setApiOnline] = useState(true)
  const [wiki, setWiki] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [playing, setPlaying] = useState(false)

  const audioRef = useRef(null)

  // 主题:应用到 <html data-theme> 并持久化
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('miku_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    [],
  )

  // Tab 持久化
  useEffect(() => {
    localStorage.setItem('miku_tab', tab)
  }, [tab])

  // 音频元素:挂载时创建一次
  useEffect(() => {
    const audio = new Audio('/miku.mp3')
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => alert('请将音乐文件命名为 miku.mp3 放到 frontend/public 目录'))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [])

  // 切换 Tab:记录方向,用于反向滑动动画
  const switchTab = useCallback(
    (next) => {
      if (next === tab) return
      setReverse(TAB_ORDER.indexOf(next) < TAB_ORDER.indexOf(tab))
      setTab(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [tab],
  )

  // 启动时加载 Wiki(失败回退到本地数据)
  useEffect(() => {
    let alive = true
    fetchWiki().then(({ data, online }) => {
      if (!alive) return
      setWiki(data)
      setApiOnline(online)
    })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      tab,
      switchTab,
      reverse,
      apiOnline,
      setApiOnline,
      wiki,
      setWiki,
      searchQuery,
      setSearchQuery,
      playing,
      toggleAudio,
    }),
    [theme, toggleTheme, tab, switchTab, reverse, apiOnline, wiki, searchQuery, playing, toggleAudio],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
