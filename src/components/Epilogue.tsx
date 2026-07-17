import { motion } from 'framer-motion'
import { epilogue } from '../data/epilogue'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onContinue: () => void
}

export function Epilogue({ onContinue }: Props) {
  return (
    <div className="epilogue">
      <div className="epilogue__aurora" aria-hidden />
      <motion.div
        className="epilogue__panel"
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="epilogue__rune">EPILOGUE {epilogue.rune}</p>
        <h2 className="epilogue__title">{epilogue.title}</h2>
        <p className="epilogue__lead">{epilogue.lead}</p>
        <div className="epilogue__body">
          {epilogue.paragraphs.map((p) => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
        </div>
        <p className="epilogue__closing">{epilogue.closing}</p>
        <button
          type="button"
          className="epilogue__btn"
          onClick={() => {
            playUiSound('confirm')
            onContinue()
          }}
        >
          REVEAL ANISSA
        </button>
      </motion.div>
    </div>
  )
}
