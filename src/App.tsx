import { useCallback, useEffect, useMemo, useState } from 'react'
import { getQuoteOfTheDay, quotes } from './data/quotes'
import { useAudio } from './hooks/useAudio'
import { AudioDock } from './components/AudioDock'
import { TextTicker } from './components/TextTicker'
import { QuotePanel } from './components/QuotePanel'
import { IntroVideo } from './components/IntroVideo'
import { CinematicVideo } from './components/CinematicVideo'
import { enterFullscreen } from './lib/fullscreen'
import './App.css'

const FRAMES = [
  '/assets/holograms/01.png',
  '/assets/holograms/02.png',
  '/assets/holograms/03.png',
]

type Phase = 'intro' | 'main' | 'outro' | 'end'

export default function App() {
  const quote = useMemo(() => getQuoteOfTheDay(), [])
  const [phase, setPhase] = useState<Phase>('intro')
  const [frame, setFrame] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const i = quotes.findIndex((q) => q.text === quote.text)
    return i >= 0 ? i : 0
  })

  const goToOutro = useCallback(() => {
    setPhase((p) => (p === 'main' ? 'outro' : p))
  }, [])

  const { playing, missing, unlock, play, stop, toggle } = useAudio({
    onEnded: goToOutro,
  })

  useEffect(() => {
    if (phase !== 'main') return
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 5000)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'main') return
    const id = window.setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase === 'outro') stop()
  }, [phase, stop])

  useEffect(() => {
    if (phase !== 'end') return
    const audio = new Audio('/assets/end.mp3')
    audio.loop = true
    audio.volume = 0.55
    void audio.play().catch(() => {
      /* blocked */
    })
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [phase])

  const handleIntroFinished = () => {
    setPhase('main')
    void play()
  }

  const handleOutroFinished = () => {
    setPhase('end')
  }

  const restart = async () => {
    await enterFullscreen()
    window.location.reload()
  }

  return (
    <div className="app">
      {phase === 'intro' && (
        <IntroVideo
          src="/assets/intro.mp4"
          cutEarlySeconds={12}
          onStart={() => {
            void unlock()
          }}
          onFinished={handleIntroFinished}
        />
      )}

      {phase === 'outro' && (
        <CinematicVideo
          src="/assets/outro.mp4"
          autoPlay
          cutEarlySeconds={8}
          onFinished={handleOutroFinished}
        />
      )}

      {phase === 'end' && (
        <div className="the-end">
          <button type="button" className="the-end__btn" onClick={restart}>
            <span className="the-end__title">THE END</span>
            <span className="the-end__sub">VERTIX</span>
          </button>
        </div>
      )}

      <div
        className={`main-shell ${phase === 'main' ? 'is-visible' : ''} ${phase === 'outro' ? 'is-exit' : ''}`}
      >
        <div className="bg">
          {FRAMES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`bg__img ${i === frame ? 'is-active' : ''}`}
            />
          ))}
          <div className="bg__shade" />
          <div className="bg__grain" />
        </div>

        <TextTicker />

        <header className="topbar">
          <h1 className="brand">VERTIX</h1>
          <AudioDock playing={playing} missing={missing} onToggle={toggle} />
        </header>

        <main className="center">
          <p className="rune">RISE. OR REMAIN LESS.</p>
          <QuotePanel quote={quotes[quoteIndex] ?? quote} />
        </main>

        <TextTicker reverse />
      </div>
    </div>
  )
}
