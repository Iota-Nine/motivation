import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { egoLines } from '../data/egoLines'

type Props = {
  active: boolean
  /** Time each line stays on screen before the next one */
  intervalMs?: number
}

export function EgoOverlay({ active, intervalMs = 7500 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % egoLines.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [active, intervalMs])

  if (!active) return null

  const line = egoLines[index]

  return (
    <div className="ego-overlay" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          className="ego-overlay__text"
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
