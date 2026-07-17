import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ascensionComplete, trials } from '../data/trials'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onPlay: () => void
}

export function AscensionPath({ onPlay }: Props) {
  const [trialIndex, setTrialIndex] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [complete, setComplete] = useState(false)

  const trial = trials[trialIndex]

  const pick = (choiceId: string) => {
    if (feedback || complete) return
    const choice = trial.choices.find((c) => c.id === choiceId)
    if (!choice) return

    playUiSound(choice.correct ? 'confirm' : 'deny')
    setFeedback(choice.reaction)
    setFailed(!choice.correct)

    window.setTimeout(() => {
      if (!choice.correct) {
        setFeedback(null)
        setFailed(false)
        return
      }
      if (trialIndex >= trials.length - 1) {
        setComplete(true)
        setFeedback(null)
        return
      }
      setTrialIndex((i) => i + 1)
      setFeedback(null)
      setFailed(false)
    }, 1600)
  }

  if (complete) {
    return (
      <div className="trial trial--complete">
        <p className="world-panel__eyebrow">PATH COMPLETE</p>
        <h3 className="world-panel__title">{ascensionComplete.title}</h3>
        <p className="world-panel__text">{ascensionComplete.lead}</p>
        <p className="world-panel__text">{ascensionComplete.body}</p>
        <button
          type="button"
          className="world-hub__cta world-hub__cta--inline"
          onClick={() => {
            playUiSound('confirm')
            onPlay()
          }}
        >
          <span>PLAY GODHOOD</span>
        </button>
      </div>
    )
  }

  return (
    <div className="trial">
      <p className="world-panel__eyebrow">
        ASCENSION {trial.rune} / {trials.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={trial.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="world-panel__title">{trial.title}</h3>
          <p className="world-panel__text">{trial.prompt}</p>

          <ul className="trial__choices">
            {trial.choices.map((choice) => (
              <li key={choice.id}>
                <button
                  type="button"
                  className="trial__choice"
                  disabled={Boolean(feedback)}
                  onClick={() => pick(choice.id)}
                >
                  {choice.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.p
            key={feedback}
            className={`trial__feedback ${failed ? 'is-fail' : 'is-pass'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
