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
        // Never loop — stop on the last line so nothing repeats
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
