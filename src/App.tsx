import { useCallback, useEffect, useState } from 'react'
import { useAudio } from './hooks/useAudio'
import { AudioDock } from './components/AudioDock'
import { TextTicker } from './components/TextTicker'
import { IntroVideo } from './components/IntroVideo'
import { CinematicVideo } from './components/CinematicVideo'
import { EldenMenu } from './components/EldenMenu'
import { GraceField } from './components/GraceField'
import { GraceSeal } from './components/GraceSeal'
import { forceFullscreen } from './lib/fullscreen'
import './App.css'

const MENU_BG = '/assets/holograms/menu.png'

type Phase = 'intro' | 'main' | 'outro' | 'end'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')

  const goToOutro = useCallback(() => {
    setPhase((p) => (p === 'main' ? 'outro' : p))
  }, [])

  const { playing, missing, unlock, play, stop, toggle } = useAudio({
    onEnded: goToOutro,
  })

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

  const handlePlay = () => {
    stop()
    goToOutro()
  }

  const restart = () => {
    forceFullscreen(document.documentElement)
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
          narratorSrc="/assets/narrator.mp3"
          autoPlay
          cutEarlySeconds={8}
          onFinished={handleOutroFinished}
        />
      )}

      {phase === 'end' && (
        <div className="the-end">
          <GraceField />
          <button type="button" className="the-end__btn" onClick={restart}>
            <span className="the-end__title">THE END</span>
            <span className="the-end__sub">GODHOOD · REIGN AGAIN</span>
          </button>
        </div>
      )}

      <div
        className={`main-shell ${phase === 'main' ? 'is-visible' : ''} ${phase === 'outro' ? 'is-exit' : ''}`}
      >
        <div className="bg">
          <img src={MENU_BG} alt="" className="bg__img is-active bg__img--menu" />
          <div className="bg__bloom" />
          <div className="bg__shade" />
          <div className="bg__grain" />
          <GraceField />
        </div>

        <TextTicker />

        <header className="topbar">
          <p className="topbar__tag">VERTIX PROTOCOL</p>
          <AudioDock playing={playing} missing={missing} onToggle={toggle} />
        </header>

        <main className="center center--menu">
          <div className="hero-brand">
            <GraceSeal />
            <h1 className="brand">GODHOOD</h1>
            <p className="brand__line">EGO · THRONE · DOMINION</p>
          </div>

          <EldenMenu onPlay={handlePlay} />
        </main>

        <TextTicker reverse />
      </div>
    </div>
  )
}
