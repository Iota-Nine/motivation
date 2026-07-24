import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { anissaProfile } from './data/anissa'
import './App.css'

const HERO = '/assets/holograms/menu.png'

const RUNES = [
  'IMMORTAL 3 · QUEEN OF THE REALM',
  'CROSSHAIR CLEAN. CROWN HEAVIER.',
  'LOBBY OPENS. THE THRONE ANSWERS.',
  'AIM LIKE LAW. EGO LIKE GRACE.',
  anissaProfile.creed.toUpperCase(),
]

type Mode = 'idle' | 'flame' | 'throne' | 'heir'

type Hotspot = {
  id: Mode
  rune: string
  title: string
  sub: string
  x: string
  y: string
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'flame',
    rune: 'I',
    title: 'OPENING FIRE',
    sub: 'Valorant gate',
    x: '16%',
    y: '58%',
  },
  {
    id: 'heir',
    rune: 'II',
    title: 'VERTIX',
    sub: 'The copy',
    x: '74%',
    y: '42%',
  },
  {
    id: 'throne',
    rune: 'III',
    title: 'FINAL GRACE',
    sub: 'Throne verdict',
    x: '84%',
    y: '72%',
  },
]

export default function App() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const introRef = useRef<HTMLVideoElement | null>(null)
  const outroRef = useRef<HTMLVideoElement | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const narratorRef = useRef<HTMLAudioElement | null>(null)

  const [booted, setBooted] = useState(false)
  const [entered, setEntered] = useState(false)
  const [mode, setMode] = useState<Mode>('idle')
  const [rune, setRune] = useState(0)
  const [music, setMusic] = useState(false)
  const [hit, setHit] = useState(0)
  const [pointer, setPointer] = useState({ x: 50, y: 42 })
  const [cross, setCross] = useState({ x: 0, y: 0, visible: false })

  useEffect(() => {
    document.documentElement.classList.add('hybrid')
    document.body.classList.add('hybrid')
    const t = window.setTimeout(() => setBooted(true), 160)
    return () => {
      window.clearTimeout(t)
      document.documentElement.classList.remove('hybrid')
      document.body.classList.remove('hybrid')
    }
  }, [])

  useEffect(() => {
    const music = new Audio('/assets/music.mp3')
    music.loop = true
    music.volume = 0.3
    musicRef.current = music

    const narrator = new Audio('/assets/narrator.mp3')
    narrator.preload = 'auto'
    narrator.volume = 0.85
    narratorRef.current = narrator

    return () => {
      music.pause()
      music.src = ''
      narrator.pause()
      narrator.src = ''
      musicRef.current = null
      narratorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!entered) return
    const id = window.setInterval(() => setRune((i) => (i + 1) % RUNES.length), 4500)
    return () => window.clearInterval(id)
  }, [entered])

  useEffect(() => {
    const intro = introRef.current
    const outro = outroRef.current
    const bed = musicRef.current
    const narrator = narratorRef.current
    if (!intro || !outro) return

    intro.pause()
    outro.pause()
    intro.currentTime = 0
    outro.currentTime = 0
    narrator?.pause()
    if (narrator) narrator.currentTime = 0

    if (mode === 'flame') {
      if (bed) bed.volume = 0.12
      intro.volume = 0.6
      void intro.play().catch(() => undefined)
    } else if (mode === 'throne') {
      if (bed) bed.volume = 0.1
      outro.volume = 0.28
      void outro.play().catch(() => undefined)
      if (narrator) {
        narrator.currentTime = 0
        void narrator.play().catch(() => undefined)
      }
    } else if (bed && !bed.paused) {
      bed.volume = 0.3
    }
  }, [mode])

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPointer({ x, y })
    setCross({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  const onLeave = () => setCross((c) => ({ ...c, visible: false }))

  const fireHit = () => {
    setHit((h) => h + 1)
    window.setTimeout(() => setHit(0), 280)
  }

  const toggleMusic = () => {
    const audio = musicRef.current
    if (!audio) return
    if (music) {
      audio.pause()
      setMusic(false)
      return
    }
    void audio.play().then(() => setMusic(true)).catch(() => setMusic(false))
  }

  const enter = () => {
    setEntered(true)
    const audio = musicRef.current
    if (audio) {
      void audio.play().then(() => setMusic(true)).catch(() => undefined)
    }
  }

  const setHotspot = (next: Mode) => {
    fireHit()
    setMode((prev) => (prev === next ? 'idle' : next))
  }

  const px = (pointer.x - 50) * 0.28
  const py = (pointer.y - 50) * 0.22

  return (
    <div
      ref={stageRef}
      className={`realm ${booted ? 'is-booted' : ''} ${entered ? 'is-entered' : ''} mode-${mode}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={fireHit}
    >
      {/* Valorant-style custom crosshair */}
      <div
        className={`crosshair ${cross.visible ? 'is-visible' : ''} ${hit > 0 ? 'is-hit' : ''}`}
        style={{ transform: `translate3d(${cross.x}px, ${cross.y}px, 0)` }}
        aria-hidden
      >
        <i className="crosshair__dot" />
        <i className="crosshair__arm crosshair__arm--n" />
        <i className="crosshair__arm crosshair__arm--s" />
        <i className="crosshair__arm crosshair__arm--e" />
        <i className="crosshair__arm crosshair__arm--w" />
        <i className="crosshair__ring" />
      </div>

      <div
        className="realm__aimlight"
        style={{
          background: `radial-gradient(380px circle at ${pointer.x}% ${pointer.y}%, rgba(255,70,85,0.16), transparent 55%)`,
        }}
      />

      <div
        className="realm__media"
        style={{ transform: `translate3d(${px * -0.5}px, ${py * -0.5}px, 0) scale(1.1)` }}
      >
        <img src={HERO} alt="" className="realm__still" />
        <video
          ref={introRef}
          className={`realm__video ${mode === 'flame' ? 'is-live' : ''}`}
          src="/assets/intro.mp4"
          playsInline
          preload="metadata"
          onEnded={() => setMode('idle')}
        />
        <video
          ref={outroRef}
          className={`realm__video ${mode === 'throne' ? 'is-live' : ''}`}
          src="/assets/outro.mp4"
          playsInline
          preload="metadata"
          onEnded={() => setMode('idle')}
        />
      </div>

      <div className="realm__shade" />
      <div className="realm__grace" />
      <div className="realm__grain" />
      <div className="realm__frame" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Valorant HUD corners */}
      <div className="hud hud--tl">
        <p className="hud__tag">AGENT</p>
        <p className="hud__value">ANISSA</p>
      </div>
      <div className="hud hud--tr">
        <p className="hud__tag">RANK</p>
        <p className="hud__value hud__value--red">IMMORTAL 3</p>
      </div>
      <div className="hud hud--bl">
        <p className="hud__tag">ROLE</p>
        <p className="hud__value">QUEEN ENTRY</p>
      </div>
      <div className="hud hud--br">
        <p className="hud__tag">REALM</p>
        <p className="hud__value hud__value--gold">GODHOOD</p>
      </div>

      <header className="topbar">
        <div className="topbar__crest">
          <span className="topbar__rune" aria-hidden />
          <div>
            <p className="topbar__mark">ELDEN PROTOCOL</p>
            <p className="topbar__sub">VALORANT BOSS · RING QUEEN</p>
          </div>
        </div>
        {entered && (
          <button type="button" className={`music ${music ? 'is-on' : ''}`} onClick={toggleMusic}>
            <span className="music__bars" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            AUDIO
          </button>
        )}
      </header>

      <AnimatePresence>
        {!entered && (
          <motion.div
            className="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.9 }}
          >
            <p className="gate__grace">Grace of the Crosshair</p>
            <h1 className="gate__title">ANISSA</h1>
            <p className="gate__line">
              Valorant boss. Elden Ring queen.
              <br />
              One lobby. One throne.
            </p>
            <button type="button" className="gate__btn" onClick={enter}>
              <span className="gate__btn-cross" aria-hidden />
              ENTER THE REALM
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {entered && (
        <>
          <main className="throne">
            <p className="throne__grace">Tarnished do not peek. Queens do.</p>
            <motion.h1
              className="throne__name"
              style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              ANISSA
            </motion.h1>
            <p className="throne__titles">
              <em>VALORANT BOSS</em>
              <span aria-hidden>·</span>
              <em>RING QUEEN</em>
            </p>

            <div className="throne__rune-wrap">
              <AnimatePresence mode="wait">
                <motion.p
                  key={rune}
                  className="throne__rune"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55 }}
                >
                  {RUNES[rune]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="loadout">
              <div className="loadout__item">
                <span>AIM</span>
                <strong>ILLEGAL</strong>
              </div>
              <div className="loadout__item">
                <span>AURA</span>
                <strong>OVERDIMENSIONAL</strong>
              </div>
              <div className="loadout__item">
                <span>THRONE</span>
                <strong>PERMANENT</strong>
              </div>
            </div>
          </main>

          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`hotspot ${mode === spot.id ? 'is-active' : ''}`}
              style={{ left: spot.x, top: spot.y }}
              onClick={(e) => {
                e.stopPropagation()
                setHotspot(spot.id)
              }}
            >
              <span className="hotspot__diamond" />
              <span className="hotspot__pulse" />
              <span className="hotspot__meta">
                <b>{spot.rune}</b>
                <strong>{spot.title}</strong>
                <small>{spot.sub}</small>
              </span>
            </button>
          ))}

          <AnimatePresence>
            {mode === 'heir' && (
              <motion.aside
                className="heir"
                initial={{ opacity: 0, x: 36, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="heir__tag">SHADOW OF THE QUEEN</p>
                <h2>VERTIX</h2>
                <p>
                  He does not duel Anissa for the crown. He studies her crosshair and her grace —
                  then copies both until the realm sees a second sun.
                </p>
                <p className="heir__law">Become her. Then become more.</p>
                <button type="button" onClick={() => setMode('idle')}>
                  CLOSE
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(mode === 'flame' || mode === 'throne') && (
              <motion.div
                className="cine-bar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span>
                  {mode === 'flame' ? 'OPENING FIRE · LIVE' : 'FINAL GRACE · NARRATOR LIVE'}
                </span>
                <button type="button" onClick={() => setMode('idle')}>
                  ABORT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
