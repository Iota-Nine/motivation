import { useCallback, useEffect, useState } from 'react'
import { useAudio } from './hooks/useAudio'
import { AudioDock } from './components/AudioDock'
import { TextTicker } from './components/TextTicker'
import { IntroVideo } from './components/IntroVideo'
import { CinematicVideo } from './components/CinematicVideo'
import { EldenMenu } from './components/EldenMenu'
import { AwakeningScreen } from './components/AwakeningScreen'
import { EndScreen } from './components/EndScreen'
import { forceFullscreen } from './lib/fullscreen'
import { getClearCount, isNewGamePlus, recordClear } from './lib/newGamePlus'
import { unlockUiSounds } from './lib/uiSounds'
import './App.css'

const MENU_BG = '/assets/holograms/menu.png'

type Phase = 'intro' | 'awakening' | 'main' | 'outro' | 'end'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [newGamePlus] = useState(() => isNewGamePlus())
  const [clears, setClears] = useState(() => getClearCount())

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
    setPhase('awakening')
  }

  const handleAwakeningFinished = useCallback(() => {
    setPhase('main')
    void play()
  }, [play])

  const handleOutroFinished = () => {
    setClears(recordClear())
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
          newGamePlus={newGamePlus}
          onStart={() => {
            void unlock()
            void unlockUiSounds()
          }}
          onFinished={handleIntroFinished}
        />
      )}

      {phase === 'awakening' && (
        <AwakeningScreen
          newGamePlus={newGamePlus}
          onFinished={handleAwakeningFinished}
        />
      )}

      {phase === 'outro' && (
        <CinematicVideo
          src="/assets/outro.mp4"
          narratorSrc="/assets/narrator.mp3"
          autoPlay
          cutEarlySeconds={8}
          newGamePlus={newGamePlus}
          onFinished={handleOutroFinished}
        />
      )}

      {phase === 'end' && <EndScreen clears={clears} onRestart={restart} />}

      <div
        className={`main-shell ${phase === 'main' ? 'is-visible' : ''} ${phase === 'outro' ? 'is-exit' : ''}`}
      >
        <div className="bg">
          <img src={MENU_BG} alt="" className="bg__img is-active bg__img--menu" />
          <div className="bg__shade" />
          <div className="bg__grain" />
        </div>

        <TextTicker />

        <header className="topbar">
          <h1 className="brand">GODHOOD</h1>
          <AudioDock playing={playing} missing={missing} onToggle={toggle} />
        </header>

        <main className="center center--menu">
          <EldenMenu onPlay={handlePlay} newGamePlus={newGamePlus} />
        </main>

        <TextTicker reverse />
      </div>
    </div>
  )
}
