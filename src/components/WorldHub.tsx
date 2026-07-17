import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { quotes } from '../data/quotes'
import {
  manifesto,
  protocolSteps,
  systemsCopy,
  systemsCopyPlus,
  worldSignals,
} from '../data/world'
import { playUiSound } from '../lib/uiSounds'

export type Chapter = 'home' | 'manifesto' | 'protocol' | 'archive' | 'systems'

type Props = {
  onPlay: () => void
  newGamePlus?: boolean
  chapter: Chapter
  onChapter: (chapter: Chapter) => void
}

const NAV: { id: Chapter; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'manifesto', label: 'MANIFESTO' },
  { id: 'protocol', label: 'PROTOCOL' },
  { id: 'archive', label: 'ARCHIVE' },
  { id: 'systems', label: 'SYSTEMS' },
]

export function WorldHub({ onPlay, newGamePlus = false, chapter, onChapter }: Props) {
  const [selected, setSelected] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length))
  const [deny, setDeny] = useState<string | null>(null)
  const systems = newGamePlus ? systemsCopyPlus : systemsCopy

  const flashDeny = useCallback((msg: string) => {
    playUiSound('deny')
    setDeny(msg)
    window.setTimeout(() => setDeny(null), 1600)
  }, [])

  const setChapter = useCallback(
    (next: Chapter) => {
      playUiSound('select')
      setSelected(0)
      onChapter(next)
    },
    [onChapter],
  )

  const play = useCallback(() => {
    playUiSound('confirm')
    onPlay()
  }, [onPlay])

  const nextQuote = useCallback(() => {
    playUiSound('select')
    setQuoteIndex((i) => (i + 1) % quotes.length)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'Escape' && chapter !== 'home') {
        e.preventDefault()
        setChapter('home')
        return
      }

      if (chapter === 'home') {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelected((s) => {
            const n = (s + 1) % 3
            playUiSound('hover')
            return n
          })
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelected((s) => {
            const n = (s + 2) % 3
            playUiSound('hover')
            return n
          })
          return
        }
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault()
          if (selected === 0) play()
          else if (selected === 1) setChapter('manifesto')
          else flashDeny('QUIT IS FOR THE WEAK. COPY ME INSTEAD.')
        }
        return
      }

      if (chapter === 'archive') {
        if (e.key === 'ArrowRight' || e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault()
          nextQuote()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, flashDeny, nextQuote, play, selected, setChapter])

  return (
    <div className={`world-hub ${chapter !== 'home' ? 'is-panel' : ''}`}>
      <div className="world-hub__hero">
        <p className="world-hub__kicker">
          {newGamePlus ? 'NEW GAME+ PROTOCOL' : 'VERTIX PROTOCOL'}
        </p>
        <h2 className="world-hub__brand">GODHOOD</h2>
        <p className="world-hub__tag">
          {newGamePlus
            ? 'Surpass the standard. Rebuild the throne.'
            : 'Copy me. Become the strongest.'}
        </p>

        <div className="world-hub__signals">
          {worldSignals.map((s) => (
            <span key={s.label} className="world-hub__signal">
              <em>{s.label}</em>
              {s.value}
            </span>
          ))}
        </div>

        <div className="world-hub__actions">
          <button
            type="button"
            className={`world-hub__cta ${selected === 0 ? 'is-active' : ''}`}
            onMouseEnter={() => {
              setSelected(0)
              playUiSound('hover')
            }}
            onClick={play}
          >
            <span>{newGamePlus ? 'PLAY · NG+' : 'PLAY'}</span>
            <span className="world-hub__cta-sub">START THE CINEMATIC</span>
          </button>
          <button
            type="button"
            className={`world-hub__ghost ${selected === 1 ? 'is-active' : ''}`}
            onMouseEnter={() => {
              setSelected(1)
              playUiSound('hover')
            }}
            onClick={() => setChapter('manifesto')}
          >
            READ MANIFESTO
          </button>
          <button
            type="button"
            className={`world-hub__ghost world-hub__ghost--mute ${selected === 2 ? 'is-active' : ''}`}
            onMouseEnter={() => {
              setSelected(2)
              playUiSound('hover')
            }}
            onClick={() => flashDeny('QUIT IS FOR THE WEAK. COPY ME INSTEAD.')}
          >
            QUIT
          </button>
        </div>
        {deny && <p className="world-hub__deny">{deny}</p>}
        <p className="world-hub__hint">↑↓ ENTER · EXPLORE CHAPTERS ABOVE</p>
      </div>

      <nav className="world-nav" aria-label="Chapters">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`world-nav__item ${chapter === item.id ? 'is-active' : ''}`}
            onClick={() => setChapter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {chapter !== 'home' && (
          <motion.section
            key={chapter}
            className="world-panel"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="world-panel__head">
              <p className="world-panel__kicker">{chapter.toUpperCase()}</p>
              <button
                type="button"
                className="world-panel__close"
                onClick={() => setChapter('home')}
              >
                CLOSE · ESC
              </button>
            </header>

            {chapter === 'manifesto' && (
              <div className="world-panel__body">
                <p className="world-panel__eyebrow">{manifesto.kicker}</p>
                <h3 className="world-panel__title">{manifesto.title}</h3>
                <p className="world-panel__text">{manifesto.body}</p>
                <ul className="world-panel__lines">
                  {manifesto.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {chapter === 'protocol' && (
              <div className="world-panel__body">
                <p className="world-panel__eyebrow">FOUR MOVES</p>
                <h3 className="world-panel__title">How GODHOOD works</h3>
                <ol className="protocol-list">
                  {protocolSteps.map((step) => (
                    <li key={step.id} className="protocol-list__item">
                      <span className="protocol-list__id">{step.id}</span>
                      <div>
                        <p className="protocol-list__title">{step.title}</p>
                        <p className="protocol-list__text">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <button type="button" className="world-hub__cta world-hub__cta--inline" onClick={play}>
                  <span>BEGIN PROTOCOL</span>
                </button>
              </div>
            )}

            {chapter === 'archive' && (
              <div className="world-panel__body world-panel__body--archive">
                <p className="world-panel__eyebrow">THRONE ROOM</p>
                <blockquote className="archive-quote">{quotes[quoteIndex].text}</blockquote>
                <p className="archive-meta">
                  {quoteIndex + 1} / {quotes.length}
                </p>
                <div className="archive-actions">
                  <button type="button" className="world-hub__ghost" onClick={nextQuote}>
                    NEXT QUOTE
                  </button>
                  <button type="button" className="world-hub__ghost" onClick={() => setChapter('home')}>
                    BACK
                  </button>
                </div>
              </div>
            )}

            {chapter === 'systems' && (
              <div className="world-panel__body">
                <p className="world-panel__eyebrow">FAKE CHOICES</p>
                <h3 className="world-panel__title">Real domination</h3>
                <ul className="systems-list">
                  {systems.map((row) => (
                    <li key={row.label}>
                      <button
                        type="button"
                        className="systems-list__row"
                        onClick={() =>
                          flashDeny('THERE IS ONLY ONE PATH. RETURN AND PLAY.')
                        }
                      >
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                      </button>
                    </li>
                  ))}
                </ul>
                {deny && <p className="world-hub__deny">{deny}</p>}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
