import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  anissaClutches,
  anissaPalmares,
  anissaProfile,
  anissaStats,
} from './data/anissa'
import { loreEntries, loreEras, loreIntro } from './data/lore'
import './App.css'

const HERO = '/assets/holograms/menu.png'

const NAV = [
  { id: 'story', label: 'Histoire' },
  { id: 'figures', label: 'Figures' },
  { id: 'media', label: 'Médias' },
  { id: 'rank', label: 'Palmarès' },
  { id: 'lore', label: 'Lore' },
] as const

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function VideoBlock({
  src,
  title,
  caption,
}: {
  src: string
  title: string
  caption: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <article className="media-card">
      <div className="media-card__frame">
        <video
          ref={ref}
          className="media-card__video"
          src={src}
          playsInline
          preload="metadata"
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button type="button" className="media-card__play" onClick={toggle}>
            Lecture
          </button>
        )}
      </div>
      <h3>{title}</h3>
      <p>{caption}</p>
    </article>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const musicRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    document.documentElement.classList.add('site-scroll')
    document.body.classList.add('site-scroll')
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.documentElement.classList.remove('site-scroll')
      document.body.classList.remove('site-scroll')
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const audio = new Audio('/assets/music.mp3')
    audio.loop = true
    audio.volume = 0.35
    musicRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      musicRef.current = null
    }
  }, [])

  const toggleMusic = () => {
    const audio = musicRef.current
    if (!audio) return
    if (musicOn) {
      audio.pause()
      setMusicOn(false)
      return
    }
    void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
  }

  const anissa = loreEntries.find((e) => e.id === 'anissa')!
  const vertix = loreEntries.find((e) => e.id === 'vertix')!

  return (
    <div className="site">
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <button type="button" className="nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span>GODHOOD</span>
          <em>Anissa</em>
        </button>
        <nav className="nav__links" aria-label="Sections">
          {NAV.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollToId(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className={`nav__music ${musicOn ? 'is-on' : ''}`} onClick={toggleMusic}>
          {musicOn ? 'Mute' : 'Musique'}
        </button>
      </header>

      <section className="hero">
        <img className="hero__bg" src={HERO} alt="" />
        <div className="hero__shade" />
        <div className="hero__content">
          <motion.p className="hero__kicker" {...fade}>
            Monde des Ego
          </motion.p>
          <motion.h1 className="hero__name" {...fade}>
            ANISSA
          </motion.h1>
          <motion.p className="hero__line" {...fade}>
            Maîtresse du monde. Vertix veut devenir comme elle.
          </motion.p>
          <motion.div className="hero__actions" {...fade}>
            <button type="button" className="btn btn--primary" onClick={() => scrollToId('story')}>
              Découvrir l’histoire
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => scrollToId('media')}>
              Voir les vidéos
            </button>
          </motion.div>
        </div>
      </section>

      <section id="story" className="section section--story">
        <motion.div className="section__inner" {...fade}>
          <p className="eyebrow">{loreIntro.kicker}</p>
          <h2 className="section__title">Une reine. Un héritier. Une seule loi.</h2>
          <p className="section__lead">{loreIntro.body}</p>
          <div className="story-grid">
            {loreEras.map((era) => (
              <article key={era.era} className="story-card">
                <span>{era.era}</span>
                <h3>{era.name}</h3>
                <p>{era.text}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="figures" className="section section--figures">
        <motion.div className="section__inner" {...fade}>
          <p className="eyebrow">Figures</p>
          <h2 className="section__title">Anissa & Vertix</h2>
          <div className="figures">
            <article className="figure figure--anissa">
              <p className="figure__role">{anissa.kicker}</p>
              <h3>{anissa.title}</h3>
              <p>{anissa.body}</p>
              <ul>
                {anissa.fragments?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="figure__creed">“{anissaProfile.creed}”</p>
            </article>
            <article className="figure figure--vertix">
              <p className="figure__role">{vertix.kicker}</p>
              <h3>{vertix.title}</h3>
              <p>{vertix.body}</p>
              <ul>
                {vertix.fragments?.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="figure__creed">“Je veux devenir Anissa — puis devenir plus.”</p>
            </article>
          </div>
        </motion.div>
      </section>

      <section id="media" className="section section--media">
        <motion.div className="section__inner" {...fade}>
          <p className="eyebrow">Médias</p>
          <h2 className="section__title">Les cinématiques, dans le site</h2>
          <p className="section__lead">
            Plus de porte d’entrée forcée. Les vidéos vivent ici, à ton rythme.
          </p>
          <div className="media-grid">
            <VideoBlock
              src="/assets/intro.mp4"
              title="Ouverture"
              caption="L’entrée dans le Monde des Ego — le regard d’Anissa."
            />
            <VideoBlock
              src="/assets/outro.mp4"
              title="Transmission finale"
              caption="La dernière flamme. Vertix absorbe la loi : copy me."
            />
          </div>
        </motion.div>
      </section>

      <section id="rank" className="section section--rank">
        <motion.div className="section__inner" {...fade}>
          <p className="eyebrow">Palmarès</p>
          <h2 className="section__title">{anissaProfile.tagline}</h2>
          <dl className="stat-row">
            {anissaStats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="rank-grid">
            {anissaPalmares.map((item) => (
              <article key={item.game} className="rank-card">
                <span>{item.game}</span>
                <strong>{item.rank}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <div className="clutch-list">
            {anissaClutches.slice(0, 3).map((clutch) => (
              <article key={clutch.id}>
                <span>{clutch.id} · {clutch.game}</span>
                <h3>{clutch.title}</h3>
                <p>{clutch.text}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="lore" className="section section--lore">
        <motion.div className="section__inner" {...fade}>
          <p className="eyebrow">Lore</p>
          <h2 className="section__title">Le monde autour d’elles</h2>
          <div className="lore-list">
            {loreEntries
              .filter((e) => e.id !== 'anissa' && e.id !== 'vertix')
              .map((entry) => (
                <article key={entry.id}>
                  <p className="eyebrow">{entry.kicker}</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.body}</p>
                </article>
              ))}
          </div>
        </motion.div>
      </section>

      <footer className="footer">
        <div>
          <strong>GODHOOD</strong>
          <span>Anissa · Vertix · Monde des Ego</span>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Haut de page
        </button>
      </footer>
    </div>
  )
}
