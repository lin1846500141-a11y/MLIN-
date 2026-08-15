import { useApp } from '../context/AppContext.jsx'
import WeaponDeck from './WeaponDeck.jsx'
import WeaponStory from './WeaponStory.jsx'
import VideoAbout from './VideoAbout.jsx'

export default function Hero() {
  const { switchTab, playing, toggleAudio } = useApp()

  return (
    <section className="editorial-home">
      <div className="hero-stage">
        <div className="hero-kicker">
          <span>VOCAL SYNTHESIS</span>
          <span>ARCHIVE NO. 01</span>
        </div>

        <button className="hero-lockup" onClick={() => switchTab('wiki')} aria-label="Open the Miku archive">
          <span className="hero-word" aria-hidden="true">
            <span>hatsune</span>
            <span className="hero-word-miku">miku<i>.</i></span>
          </span>
          <span className="hero-script">Future voices, forever.</span>
        </button>

        <p className="hero-statement">
          A living index of virtual culture,<br />
          music and memory.
        </p>

        <div className="scroll-cue" aria-hidden="true"><span>SCROLL</span><i /></div>

        <footer className="hero-footer">
          <button onClick={() => switchTab('wiki')}>Explore Wiki</button>
          <button onClick={() => switchTab('guestbook')}>Guestbook</button>
          <button onClick={() => switchTab('about')}>About</button>
          <button onClick={toggleAudio}>{playing ? 'Pause Sound' : 'Play Sound'}</button>
        </footer>
      </div>

      <WeaponDeck onExplore={() => switchTab('wiki')} />
      <WeaponStory
        onContinue={() => document.getElementById('about-transition')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <VideoAbout onEnterAbout={() => switchTab('about')} />
    </section>
  )
}
