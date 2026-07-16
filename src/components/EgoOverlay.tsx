import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  active: boolean
  lines: string[]
  /** Time each line stays on screen before the next one */
  intervalMs?: number
}

export function EgoOverlay({ active, lines, intervalMs = 7500 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      return
    }
    if (lines.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((i) => {
        if (i >= lines.length - 1) return i
        return i + 1
      })
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [active, intervalMs, lines.length])

  if (!active || lines.length === 0) return null

  const line = lines[Math.min(index, lines.length - 1)]

  return (
    <div className="ego-overlay" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={line}
          className="ego-overlay__frame"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)', scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -14, filter: 'blur(8px)', scale: 1.02 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ego-overlay__ornament" aria-hidden />
          <p className="ego-overlay__text">{line}</p>
          <span className="ego-overlay__ornament ego-overlay__ornament--flip" aria-hidden />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
