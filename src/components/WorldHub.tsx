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
import { loreEntries, loreEras, loreIntro, loreLaws } from '../data/lore'
import { playUiSound } from '../lib/uiSounds'

export type Chapter = 'home' | 'lore' | 'manifesto' | 'protocol' | 'archive' | 'systems'

type LoreTab = 'canon' | 'figures' | 'eras' | 'laws'

type Props = {
  onPlay: () => void
  newGamePlus?: boolean
  chapter: Chapter
  onChapter: (chapter: Chapter) => void
}

const NAV: { id: Chapter; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'lore', label: 'LORE' },
  { id: 'manifesto', label: 'MANIFESTO' },
  { id: 'protocol', label: 'PROTOCOL' },
  { id: 'archive', label: 'ARCHIVE' },
  { id: 'systems', label: 'SYSTEMS' },
]

const LORE_TABS: { id: LoreTab; label: string }[] = [
  { id: 'canon', label: 'CANON' },
  { id: 'figures', label: 'FIGURES' },
  { id: 'eras', label: 'ERAS' },
  { id: 'laws', label: 'LAWS' },
]

export function WorldHub({ onPlay, newGamePlus = false, chapter, onChapter }: Props) {
  const [selected, setSelected] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length))
  const [deny, setDeny] = useState<string | null>(null)
  const [loreTab, setLoreTab] = useState<LoreTab>('canon')
  const [figureIndex, setFigureIndex] = useState(0)
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

  const switchLoreTab = useCallback((tab: LoreTab) => {
    playUiSound('select')
    setLoreTab(tab)
  }, [])

  const nextFigure = useCallback(() => {
    playUiSound('select')
    setFigureIndex((i) => (i + 1) % loreEntries.length)
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
          else if (selected === 1) setChapter('lore')
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

      if (chapter === 'lore' && loreTab === 'figures') {
        if (e.key === 'ArrowRight' || e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault()
          nextFigure()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    chapter,
    flashDeny,
    loreTab,
    nextFigure,
    nextQuote,
    play,
    selected,
    setChapter,
  ])

  const figure = loreEntries[figureIndex]

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
            : 'A sealed realm of ego, throne, and ascent.'}
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
            <span className="world-hub__cta-sub">ENTER THE REALM</span>
          </button>
          <button
            type="button"
            className={`world-hub__ghost ${selected === 1 ? 'is-active' : ''}`}
            onMouseEnter={() => {
              setSelected(1)
              playUiSound('hover')
            }}
            onClick={() => setChapter('lore')}
          >
            READ THE LORE
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
        <p className="world-hub__hint">↑↓ ENTER · LORE · MANIFESTO · PROTOCOL</p>
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
            className="world-panel world-panel--scroll"
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

            {chapter === 'lore' && (
              <div className="world-panel__body">
                <div className="lore-tabs" role="tablist" aria-label="Lore sections">
                  {LORE_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={loreTab === tab.id}
                      className={`lore-tabs__item ${loreTab === tab.id ? 'is-active' : ''}`}
                      onClick={() => switchLoreTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={loreTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                    className="lore-pane"
                  >
                    {loreTab === 'canon' && (
                      <>
                        <p className="world-panel__eyebrow">{loreIntro.kicker}</p>
                        <h3 className="world-panel__title">{loreIntro.title}</h3>
                        <p className="world-panel__text">{loreIntro.body}</p>
                        <ul className="lore-era-strip">
                          {loreEras.map((era) => (
                            <li key={era.era}>
                              <span>{era.era}</span>
                              <strong>{era.name}</strong>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {loreTab === 'figures' && (
                      <>
                        <p className="world-panel__eyebrow">{figure.kicker}</p>
                        <h3 className="world-panel__title">{figure.title}</h3>
                        <p className="world-panel__text">{figure.body}</p>
                        {figure.fragments && (
                          <ul className="world-panel__lines">
                            {figure.fragments.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        )}
                        <div className="archive-actions">
                          <button type="button" className="world-hub__ghost" onClick={nextFigure}>
                            NEXT FIGURE · {figureIndex + 1}/{loreEntries.length}
                          </button>
                        </div>
                      </>
                    )}

                    {loreTab === 'eras' && (
                      <>
                        <p className="world-panel__eyebrow">TIMELINE</p>
                        <h3 className="world-panel__title">Ages of the realm</h3>
                        <ol className="protocol-list">
                          {loreEras.map((era) => (
                            <li key={era.era} className="protocol-list__item">
                              <span className="protocol-list__id">{era.era.replace('ERA ', '')}</span>
                              <div>
                                <p className="protocol-list__title">{era.name}</p>
                                <p className="protocol-list__text">{era.text}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}

                    {loreTab === 'laws' && (
                      <>
                        <p className="world-panel__eyebrow">CODE OF THE THRONE</p>
                        <h3 className="world-panel__title">Five laws of GODHOOD</h3>
                        <ul className="lore-laws">
                          {loreLaws.map((law) => (
                            <li key={law.code} className="lore-laws__item">
                              <div className="lore-laws__head">
                                <span>{law.code}</span>
                                <strong>{law.title}</strong>
                              </div>
                              <p>{law.text}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

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
                <p className="world-panel__eyebrow">THRONE ROOM RELICS</p>
                <blockquote className="archive-quote">{quotes[quoteIndex].text}</blockquote>
                <p className="archive-meta">
                  {quoteIndex + 1} / {quotes.length}
                </p>
                <div className="archive-actions">
                  <button type="button" className="world-hub__ghost" onClick={nextQuote}>
                    NEXT RELIC
                  </button>
                  <button type="button" className="world-hub__ghost" onClick={() => setChapter('lore')}>
                    OPEN LORE
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
