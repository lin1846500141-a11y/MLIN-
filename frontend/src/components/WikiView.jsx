import { useApp } from '../context/AppContext.jsx'

export default function WikiView() {
  const { wiki, searchQuery } = useApp()

  const kw = searchQuery.trim().toLowerCase()
  const list = kw
    ? wiki.filter(
        (i) =>
          i.title.toLowerCase().includes(kw) ||
          i.desc.toLowerCase().includes(kw) ||
          i.tag.toLowerCase().includes(kw),
      )
    : wiki

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 25 }}>
        WIKI <span>ARCHIVE</span>
      </h1>
      <div className="grid">
        {list.length === 0 ? (
          <p className="no-result">// 未找到匹配的条目</p>
        ) : (
          list.map((item) => (
            <div className="wiki-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="tag">{item.tag}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
