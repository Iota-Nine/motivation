import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
    window.setTimeout(() => setDenyFlash(null), 1800)
  }

  return (
    <div className="elden-menu">
      <AnimatePresence mode="wait">
        {screen === 'options' ? (
          <motion.div
            key="options"
            className="elden-menu__panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="elden-menu__eyebrow">SYSTEM</p>
            <p className="elden-menu__title">OPTIONS</p>
            <p className="elden-menu__subtitle">FAKE CHOICES. REAL DOMINATION.</p>

            <ul className="elden-menu__list">
              {FAKE_OPTIONS.map((opt, i) => (
                <li key={opt.label}>
                  <button
                    type="button"
                    className={`elden-menu__item ${selected === i ? 'is-active' : ''}`}
                    onMouseEnter={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
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
              onClick={() => {
                setSelected(0)
                setScreen('root')
              }}
            >
              <span className="elden-menu__caret" />
              <span className="elden-menu__label">BACK</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="root"
            className="elden-menu__panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="elden-menu__list">
              <li>
                <button
                  type="button"
                  className={`elden-menu__item ${selected === 0 ? 'is-active' : ''}`}
                  onMouseEnter={() => setSelected(0)}
                  onFocus={() => setSelected(0)}
                  onClick={onPlay}
                >
                  <span className="elden-menu__caret" />
                  <span className="elden-menu__label">PLAY</span>
                  <span className="elden-menu__hint">BEGIN ASCENSION</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`elden-menu__item ${selected === 1 ? 'is-active' : ''}`}
                  onMouseEnter={() => setSelected(1)}
                  onFocus={() => setSelected(1)}
                  onClick={() => {
                    setSelected(0)
                    setScreen('options')
                  }}
                >
                  <span className="elden-menu__caret" />
                  <span className="elden-menu__label">OPTIONS</span>
                  <span className="elden-menu__hint">ILLUSION OF CHOICE</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`elden-menu__item ${selected === 2 ? 'is-active' : ''}`}
                  onMouseEnter={() => setSelected(2)}
                  onFocus={() => setSelected(2)}
                  onClick={() => flashDeny('QUIT IS FOR THE WEAK. COPY ME INSTEAD.')}
                >
                  <span className="elden-menu__caret" />
                  <span className="elden-menu__label">QUIT</span>
                  <span className="elden-menu__hint">DENIED</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {denyFlash && (
          <motion.p
            key={denyFlash}
            className="elden-menu__deny"
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {denyFlash}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
