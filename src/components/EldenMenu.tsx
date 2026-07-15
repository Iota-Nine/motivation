import { useState } from 'react'

type Props = {
  onPlay: () => void
}

const FAKE_OPTIONS = [
  { label: 'DIFFICULTY', value: 'GODHOOD ONLY' },
  { label: 'EGO', value: 'OVERDIMENSIONAL' },
  { label: 'ROLE', value: 'QUEEN OF EVERYTHING' },
  { label: 'WORLD STATUS', value: 'UNDER MY CONTROL' },
  { label: 'MISSION', value: 'VERTIX · COPY ME' },
  { label: 'PATHS AVAILABLE', value: '1  ·  PLAY' },
]

export function EldenMenu({ onPlay }: Props) {
  const [screen, setScreen] = useState<'root' | 'options'>('root')
  const [selected, setSelected] = useState(0)
  const [denyFlash, setDenyFlash] = useState<string | null>(null)

  const flashDeny = (msg: string) => {
    setDenyFlash(msg)
    window.setTimeout(() => setDenyFlash(null), 1600)
  }

  if (screen === 'options') {
    return (
      <div className="elden-menu">
        <p className="elden-menu__title">OPTIONS</p>
        <p className="elden-menu__subtitle">FAKE CHOICES. REAL DOMINATION.</p>

        <ul className="elden-menu__list">
          {FAKE_OPTIONS.map((opt, i) => (
            <li key={opt.label}>
              <button
                type="button"
                className={`elden-menu__item ${selected === i ? 'is-active' : ''}`}
                onMouseEnter={() => setSelected(i)}
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
          className="elden-menu__item elden-menu__item--solo"
          onClick={() => setScreen('root')}
        >
          <span className="elden-menu__caret" />
          <span className="elden-menu__label">BACK</span>
        </button>

        {denyFlash && <p className="elden-menu__deny">{denyFlash}</p>}
      </div>
    )
  }

  return (
    <div className="elden-menu">
      <p className="elden-menu__title">VERTIX</p>
      <p className="elden-menu__subtitle">COPY ME. BECOME THE STRONGEST.</p>

      <ul className="elden-menu__list">
        <li>
          <button
            type="button"
            className={`elden-menu__item ${selected === 0 ? 'is-active' : ''}`}
            onMouseEnter={() => setSelected(0)}
            onClick={onPlay}
          >
            <span className="elden-menu__caret" />
            <span className="elden-menu__label">PLAY</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`elden-menu__item ${selected === 1 ? 'is-active' : ''}`}
            onMouseEnter={() => setSelected(1)}
            onClick={() => {
              setSelected(0)
              setScreen('options')
            }}
          >
            <span className="elden-menu__caret" />
            <span className="elden-menu__label">OPTIONS</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`elden-menu__item ${selected === 2 ? 'is-active' : ''}`}
            onMouseEnter={() => setSelected(2)}
            onClick={() => flashDeny('QUIT IS FOR THE WEAK. COPY ME INSTEAD.')}
          >
            <span className="elden-menu__caret" />
            <span className="elden-menu__label">QUIT</span>
          </button>
        </li>
      </ul>

      {denyFlash && <p className="elden-menu__deny">{denyFlash}</p>}
    </div>
  )
}
