import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { speakerLabel, throneDialogue } from '../data/dialogue'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onContinue: () => void
}

export function DialogueScene({ onContinue }: Props) {
  const [index, setIndex] = useState(0)
  const line = throneDialogue.lines[index]
  const isLast = index >= throneDialogue.lines.length - 1

  const advance = () => {
    playUiSound(isLast ? 'confirm' : 'select')
    if (isLast) {
      onContinue()
      return
    }
    setIndex((i) => i + 1)
  }

  return (
    <div className="dialogue">
      <p className="world-panel__eyebrow">{throneDialogue.setting}</p>
      <h3 className="world-panel__title">{throneDialogue.title}</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${line.speaker}-${index}`}
          className={`dialogue__bubble dialogue__bubble--${line.speaker}`}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="dialogue__speaker">{speakerLabel[line.speaker]}</p>
          <p className="dialogue__text">{line.text}</p>
        </motion.div>
      </AnimatePresence>

      <div className="dialogue__progress" aria-hidden>
        {throneDialogue.lines.map((_, i) => (
          <span
            key={i}
            className={`dialogue__dot ${i === index ? 'is-active' : ''} ${i < index ? 'is-done' : ''}`}
          />
        ))}
      </div>

      <button type="button" className="world-hub__cta world-hub__cta--inline" onClick={advance}>
        <span>{isLast ? 'ENTER THE TRIALS' : 'CONTINUE'}</span>
      </button>
    </div>
  )
}
