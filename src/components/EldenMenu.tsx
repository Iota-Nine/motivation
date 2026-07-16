import { useCallback, useEffect, useState } from 'react'
import { quotes } from '../data/quotes'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onPlay: () => void
  newGamePlus?: boolean
}

const FAKE_OPTIONS = [
  { label: 'DIFFICULTY', value: 'GODHOOD ONLY' },
  { label: 'EGO', value: 'OVERDIMENSIONAL' },
  { label: 'ROLE', value: 'QUEEN OF EVERYTHING' },
  { label: 'WORLD STATUS', value: 'UNDER MY CONTROL' },
  { label: 'MISSION', value: 'VERTIX · COPY ME' },
  { label: 'PATHS AVAILABLE', value: '1  ·  PLAY' },
]

const FAKE_OPTIONS_PLUS = [
  { label: 'DIFFICULTY', value: 'NEW GAME+ ONLY' },
  { label: 'EGO', value: 'ABSOLUTE' },
  { label: 'ROLE', value: 'QUEEN REFORGED' },
  { label: 'WORLD STATUS', value: 'ALREADY MINE' },
  { label: 'MISSION', value: 'SURPASS VERTIX' },
  { label: 'PATHS AVAILABLE', value: '1  ·  PLAY' },
]

const ROOT_ITEMS = ['PLAY', 'QUOTES', 'OPTIONS', 'QUIT'] as const

type Screen = 'root' | 'options' | 'quotes'

export function EldenMenu({ onPlay, newGamePlus = false }: Props) {
  const [screen, setScreen] = useState<Screen>('root')
  const [selected, setSelected] = useState(0)
  const [denyFlash, setDenyFlash] = useState<string | null>(null)
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length))

  const options = newGamePlus ? FAKE_OPTIONS_PLUS : FAKE_OPTIONS

  const flashDeny = useCallback((msg: string) => {
    playUiSound('deny')
    setDenyFlash(msg)
    window.setTimeout(() => setDenyFlash(null), 1600)
  }, [])

  const goScreen = useCallback((next: Screen, index = 0) => {
    playUiSound('select')
    setSelected(index)
    setScreen(next)
  }, [])

  const hover = useCallback((index: number) => {
    setSelected((prev) => {
      if (prev !== index) playUiSound('hover')
      return index
    })
  }, [])

  const activateRoot = useCallback(
    (index: number) => {
      const item = ROOT_ITEMS[index]
      if (item === 'PLAY') {
        playUiSound('confirm')
        onPlay()
        return
      }
      if (item === 'QUOTES') {
        goScreen('quotes')
        return
      }
      if (item === 'OPTIONS') {
        goScreen('options')
        return
      }
      flashDeny('QUIT IS FOR THE WEAK. COPY ME INSTEAD.')
    },
    [flashDeny, goScreen, onPlay],
  )

  const nextQuote = useCallback(() => {
    playUiSound('select')
    setQuoteIndex((i) => (i + 1) % quotes.length)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (screen === 'quotes') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          hover(selected === 0 ? 1 : 0)
          return
        }
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault()
          if (selected === 0) nextQuote()
          else goScreen('root', 1)
          return
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          nextQuote()
          return
        }
        if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'ArrowLeft') {
          e.preventDefault()
          goScreen('root', 1)
        }
        return
      }

      const count = screen === 'root' ? ROOT_ITEMS.length : options.length + 1
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        hover((selected + 1) % count)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        hover((selected - 1 + count) % count)
        return
      }
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        if (screen === 'root') {
          activateRoot(selected)
          return
        }
        if (selected >= options.length) {
          goScreen('root', 2)
        } else {
          flashDeny('THERE IS ONLY ONE PATH. RETURN AND PLAY.')
        }
        return
      }
      if (e.key === 'Escape' && screen === 'options') {
        e.preventDefault()
        goScreen('root', 2)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activateRoot, flashDeny, goScreen, hover, nextQuote, options.length, screen, selected])

  if (screen === 'quotes') {
    const quote = quotes[quoteIndex]
    return (
      <div className="elden-menu elden-menu--quotes">
        <p className="elden-menu__title">QUOTES</p>
        <p className="elden-menu__subtitle">THRONE ROOM PROTOCOL</p>
        <blockquote className="elden-menu__quote">{quote.text}</blockquote>
        <p className="elden-menu__quote-meta">
          {quoteIndex + 1} / {quotes.length}
        </p>
        <ul className="elden-menu__list">
          <li>
            <button
              type="button"
              className={`elden-menu__item ${selected === 0 ? 'is-active' : ''}`}
              onMouseEnter={() => hover(0)}
              onClick={nextQuote}
            >
              <span className="elden-menu__caret" />
              <span className="elden-menu__label">NEXT</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`elden-menu__item ${selected === 1 ? 'is-active' : ''}`}
              onMouseEnter={() => hover(1)}
              onClick={() => goScreen('root', 1)}
            >
              <span className="elden-menu__caret" />
              <span className="elden-menu__label">BACK</span>
            </button>
          </li>
        </ul>
        <p className="elden-menu__hint">↑↓ ENTER · ← ESC BACK</p>
      </div>
    )
  }

  if (screen === 'options') {
    return (
      <div className="elden-menu">
        <p className="elden-menu__title">OPTIONS</p>
        <p className="elden-menu__subtitle">FAKE CHOICES. REAL DOMINATION.</p>

        <ul className="elden-menu__list">
          {options.map((opt, i) => (
            <li key={opt.label}>
              <button
                type="button"
                className={`elden-menu__item ${selected === i ? 'is-active' : ''}`}
                onMouseEnter={() => hover(i)}
                onClick={() => flashDeny('THERE IS ONLY ONE PATH. RETURN AND PLAY.')}
              >
                <span className="elden-menu__caret" />
                <span className="elden-menu__label">{opt.label}</span>
                <span className="elden-menu__value">{opt.value}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`elden-menu__item elden-menu__item--solo ${selected === options.length ? 'is-active' : ''}`}
          onMouseEnter={() => hover(options.length)}
          onClick={() => goScreen('root', 2)}
        >
          <span className="elden-menu__caret" />
          <span className="elden-menu__label">BACK</span>
        </button>

        {denyFlash && <p className="elden-menu__deny">{denyFlash}</p>}
        <p className="elden-menu__hint">↑↓ ENTER · ESC BACK</p>
      </div>
    )
  }

  return (
    <div className="elden-menu">
      <p className="elden-menu__title">GODHOOD</p>
      <p className="elden-menu__subtitle">
        {newGamePlus ? 'NEW GAME+. SURPASS THE STANDARD.' : 'COPY ME. BECOME THE STRONGEST.'}
      </p>

      <ul className="elden-menu__list">
        {ROOT_ITEMS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`elden-menu__item ${selected === i ? 'is-active' : ''}`}
              onMouseEnter={() => hover(i)}
              onClick={() => activateRoot(i)}
            >
              <span className="elden-menu__caret" />
              <span className="elden-menu__label">
                {label === 'PLAY' && newGamePlus ? 'PLAY · NG+' : label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {denyFlash && <p className="elden-menu__deny">{denyFlash}</p>}
      <p className="elden-menu__hint">↑↓ ENTER</p>
    </div>
  )
}
