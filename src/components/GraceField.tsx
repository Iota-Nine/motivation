import { useMemo, type CSSProperties } from 'react'

type Particle = {
  id: number
  left: string
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
}

type EmberStyle = CSSProperties & { '--drift': string }

/** Floating golden grace embers — Elden Ring atmosphere. */
export function GraceField() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        size: 1.5 + (i % 5) * 0.7,
        delay: (i % 12) * 0.55,
        duration: 9 + (i % 8) * 1.4,
        drift: ((i % 7) - 3) * 18,
        opacity: 0.35 + (i % 5) * 0.1,
      })),
    [],
  )

  return (
    <div className="grace-field" aria-hidden>
      {particles.map((p) => {
        const style: EmberStyle = {
          left: p.left,
          width: p.size,
          height: p.size,
          opacity: p.opacity,
          '--drift': `${p.drift}px`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }
        return <span key={p.id} className="grace-field__ember" style={style} />
      })}
    </div>
  )
}
