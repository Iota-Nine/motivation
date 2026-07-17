import { useCallback, useEffect, useRef, useState } from 'react'
import { useAudio } from './hooks/useAudio'
import { AudioDock } from './components/AudioDock'
import { TextTicker } from './components/TextTicker'
import { IntroVideo } from './components/IntroVideo'
import { CinematicVideo } from './components/CinematicVideo'
import { AwakeningScreen } from './components/AwakeningScreen'
import { EndScreen } from './components/EndScreen'
import { AnissaSite } from './components/AnissaSite'
import { AmbientField } from './components/AmbientField'
import { CustomCursor } from './components/CustomCursor'
import { StatusHud } from './components/StatusHud'
import { WorldHub, type Chapter } from './components/WorldHub'
import { Epilogue } from './components/Epilogue'
import { forceFullscreen } from './lib/fullscreen'
import { getClearCount, isNewGamePlus, recordClear } from './lib/newGamePlus'
import { unlockUiSounds } from './lib/uiSounds'
import './App.css'

const MENU_BG = '/assets/holograms/menu.png'

type Phase = 'intro' | 'awakening' | 'main' | 'outro' | 'end' | 'epilogue' | 'anissa'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [newGamePlus] = useState(() => isNewGamePlus())
  const [clears, setClears] = useState(() => getClearCount())
  const [chapter, setChapter] = useState<Chapter>('home')
  const bgRef = useRef<HTMLImageElement | null>(null)

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
    if (phase !== 'end' && phase !== 'epilogue' && phase !== 'anissa') return
    const audio = new Audio('/assets/end.mp3')
    audio.loop = true
    audio.volume = phase === 'anissa' ? 0.4 : 0.55
    void audio.play().catch(() => {
      /* blocked */
    })
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'main') return
    const onMove = (e: PointerEvent) => {
      const img = bgRef.current
      if (!img) return
      const x = (e.clientX / window.innerWidth - 0.5) * 12
      const y = (e.clientY / window.innerHeight - 0.5) * 8
      img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
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

  const openEpilogue = () => {
    forceFullscreen(document.documentElement)
    setPhase('epilogue')
    window.scrollTo(0, 0)
  }

  const openAnissaSite = () => {
    forceFullscreen(document.documentElement)
    setPhase('anissa')
    window.scrollTo(0, 0)
  }

  const restart = () => {
    forceFullscreen(document.documentElement)
    window.location.reload()
  }

  return (
    <div className={`app ${phase === 'anissa' ? 'app--anissa' : ''}`}>
      <CustomCursor />

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

      {phase === 'end' && <EndScreen clears={clears} onContinue={openEpilogue} />}

      {phase === 'epilogue' && <Epilogue onContinue={openAnissaSite} />}

      {phase === 'anissa' && <AnissaSite onReplay={restart} />}

      <div
        className={`main-shell ${phase === 'main' ? 'is-visible' : ''} ${phase === 'outro' ? 'is-exit' : ''}`}
      >
        <div className="bg">
          <img
            ref={bgRef}
            src={MENU_BG}
            alt=""
            className="bg__img is-active bg__img--menu bg__img--parallax"
          />
          <div className="bg__shade" />
          <div className="bg__veil" />
          <div className="bg__grain" />
          <AmbientField />
        </div>

        <TextTicker />

        <header className="topbar topbar--site">
          <div className="topbar__brand-wrap">
            <p className="topbar__mark">ANISSA · VERTIX</p>
            <h1 className="brand">GODHOOD</h1>
          </div>
          <StatusHud clears={clears} newGamePlus={newGamePlus} playing={playing} />
          <AudioDock playing={playing} missing={missing} onToggle={toggle} />
        </header>

        <main className="center center--hub">
          <WorldHub
            onPlay={handlePlay}
            newGamePlus={newGamePlus}
            chapter={chapter}
            onChapter={setChapter}
          />
        </main>

        <footer className="site-footer">
          <span>GODHOOD / 2026</span>
          <span>COPY ANISSA · BECOME THE STRONGEST</span>
          <span>BUILD 2.1</span>
        </footer>

        <TextTicker reverse />
      </div>
    </div>
  )
}
