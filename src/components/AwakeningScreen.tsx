import { useEffect, useRef, useState } from 'react'

type Props = {
  onFinished: () => void
  newGamePlus?: boolean
}

const LINES = [
  'CALIBRATING EGO…',
  'SEALING DOUBT…',
  'AWAKENING THRONE…',
  'GODHOOD ONLINE',
]

const NG_LINES = [
  'NEW GAME+ DETECTED…',
  'RAISING THE STANDARD…',
  'NO MERCY MODE…',
  'GODHOOD REFORGED',
]

export function AwakeningScreen({ onFinished, newGamePlus = false }: Props) {
  const lines = newGamePlus ? NG_LINES : LINES
  const [progress, setProgress] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    const start = performance.now()
    const duration = newGamePlus ? 2800 : 3200
    let raf = 0
    let timeout = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Ease-out so it feels like a real load bar
      const eased = 1 - (1 - t) ** 2.4
      setProgress(eased * 100)
      setLineIndex(Math.min(lines.length - 1, Math.floor(t * lines.length)))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        timeout = window.setTimeout(onFinished, 380)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
  }, [lines.length, newGamePlus, onFinished])

  return (
    <div className="awakening" role="status" aria-live="polite">
      <div className="awakening__grain" aria-hidden />
      <p className="awakening__brand">GODHOOD</p>
      <p className="awakening__line">{lines[lineIndex]}</p>
      <div className="awakening__bar" aria-hidden>
        <div className="awakening__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="awakening__pct">{Math.round(progress)}%</p>
    </div>
  )
}
