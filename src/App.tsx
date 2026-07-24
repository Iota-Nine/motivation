import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { anissaProfile, anissaStats } from './data/anissa'
import './App.css'

const HERO = '/assets/holograms/menu.png'

const LINES = [
  'Maîtresse du Monde des Ego.',
  'Vertix veut devenir comme elle.',
  'Copy me. Become the strongest.',
  'Une seule loi. Une seule flamme.',
  anissaProfile.creed,
]

type Layer = 'none' | 'intro' | 'outro' | 'vertix'

type Node = {
  id: Layer
  label: string
  x: string
  y: string
  hint: string
}

const NODES: Node[] = [
  { id: 'intro', label: 'FLAMME', x: '18%', y: '62%', hint: 'Ouverture' },
  { id: 'vertix', label: 'VERTIX', x: '72%', y: '48%', hint: 'L’héritier' },
  { id: 'outro', label: 'TRÔNE', x: '82%', y: '78%', hint: 'Transmission' },
]

export default function App() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const introRef = useRef<HTMLVideoElement | null>(null)
  const outroRef = useRef<HTMLVideoElement | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)

  const [ready, setReady] = useState(false)
  const [line, setLine] = useState(0)
  const [layer, setLayer] = useState<Layer>('none')
  const [music, setMusic] = useState(false)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [spark, setSpark] = useState<{ x: number; y: number; id: number } | null>(null)

  useEffect(() => {
    document.documentElement.classList.add('immersive')
    document.body.classList.add('immersive')
    const boot = window.setTimeout(() => setReady(true), 120)
    return () => {
      window.clearTimeout(boot)
      document.documentElement.classList.remove('immersive')
      document.body.classList.remove('immersive')
    }
  }, [])

  useEffect(() => {
    const audio = new Audio('/assets/music.mp3')
    audio.loop = true
    audio.volume = 0.32
    musicRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      musicRef.current = null
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setLine((i) => (i + 1) % LINES.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const intro = introRef.current
    const outro = outroRef.current
    if (!intro || !outro) return

    const stopAll = () => {
      intro.pause()
      outro.pause()
      intro.currentTime = 0
      outro.currentTime = 0
    }

    stopAll()

    if (layer === 'intro') {
      intro.volume = 0.55
      void intro.play().catch(() => undefined)
    } else if (layer === 'outro') {
      outro.volume = 0.55
      void outro.play().catch(() => undefined)
    }

    return () => {
      /* keep refs */
    }
  }, [layer])

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPointer({ x, y })
  }

  const pulse = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpark({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    })
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

  const openLayer = (next: Layer) => {
    setLayer((prev) => (prev === next ? 'none' : next))
  }

  const px = (pointer.x - 50) * 0.35
  const py = (pointer.y - 50) * 0.28

  return (
    <div
      ref={stageRef}
      className={`stage ${ready ? 'is-ready' : ''} ${layer !== 'none' ? 'has-layer' : ''}`}
      onPointerMove={onMove}
      onPointerDown={pulse}
    >
      <div
        className="stage__glow"
        style={{
          background: `radial-gradient(420px circle at ${pointer.x}% ${pointer.y}%, rgba(255,77,58,0.18), transparent 55%)`,
        }}
      />

      <div className="stage__media" style={{ transform: `translate3d(${px * -0.4}px, ${py * -0.4}px, 0) scale(1.08)` }}>
        <img src={HERO} alt="" className="stage__still" />
        <video
          ref={introRef}
          className={`stage__video ${layer === 'intro' ? 'is-live' : ''}`}
          src="/assets/intro.mp4"
          playsInline
          muted={false}
          loop
          preload="metadata"
        />
        <video
          ref={outroRef}
          className={`stage__video ${layer === 'outro' ? 'is-live' : ''}`}
          src="/assets/outro.mp4"
          playsInline
          muted={false}
          loop
          preload="metadata"
        />
      </div>

      <div className="stage__veil" />
      <div className="stage__grain" />
      <div className="stage__vignette" />

      <header className="stage__top">
        <p className="stage__mark">GODHOOD</p>
        <button type="button" className={`stage__music ${music ? 'is-on' : ''}`} onClick={toggleMusic}>
          <span className="stage__music-bars" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          {music ? 'ON' : 'OFF'}
        </button>
      </header>

      <main className="stage__core">
        <motion.p
          className="stage__role"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          Master of the World of Ego
        </motion.p>

        <motion.h1
          className="stage__name"
          style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          ANISSA
        </motion.h1>

        <div className="stage__line-wrap">
          <AnimatePresence mode="wait">
            <motion.p
              key={line}
              className="stage__line"
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {LINES[line]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="stage__stats" aria-hidden={layer !== 'none'}>
          {anissaStats.slice(0, 4).map((stat) => (
            <button
              key={stat.label}
              type="button"
              className="stage__stat"
              onClick={() => setLine((i) => (i + 1) % LINES.length)}
            >
              <em>{stat.label}</em>
              <strong>{stat.value}</strong>
            </button>
          ))}
        </div>
      </main>

      {NODES.map((node) => (
        <button
          key={node.id}
          type="button"
          className={`node ${layer === node.id ? 'is-active' : ''}`}
          style={{ left: node.x, top: node.y }}
          onClick={(e) => {
            e.stopPropagation()
            openLayer(node.id)
          }}
        >
          <span className="node__ring" />
          <span className="node__core" />
          <span className="node__label">
            {node.label}
            <small>{node.hint}</small>
          </span>
        </button>
      ))}

      <AnimatePresence>
        {layer === 'vertix' && (
          <motion.aside
            className="vertix-panel"
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="vertix-panel__kicker">HEIR OF THE FLAME</p>
            <h2>VERTIX</h2>
            <p>
              Pas un rival. Une copie vivante. Vertix regarde Anissa et choisit la seule voie honnête :
              absorber sa flamme jusqu’à devenir un second soleil.
            </p>
            <p className="vertix-panel__creed">Become her. Then become more.</p>
            <button type="button" className="vertix-panel__close" onClick={() => setLayer('none')}>
              Fermer
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(layer === 'intro' || layer === 'outro') && (
          <motion.div
            className="film-tag"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span>{layer === 'intro' ? 'OUVERTURE LIVE' : 'TRANSMISSION LIVE'}</span>
            <button type="button" onClick={() => setLayer('none')}>
              Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {spark && (
          <motion.span
            key={spark.id}
            className="spark"
            style={{ left: spark.x, top: spark.y }}
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            onAnimationComplete={() => setSpark(null)}
          />
        )}
      </AnimatePresence>

      <p className="stage__hint">Bouge. Touche les nœuds. Réveille la flamme.</p>
    </div>
  )
}
