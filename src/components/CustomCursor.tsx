import { useEffect, useState } from 'react'

/** Gold crosshair cursor — desktop only, respects reduced motion / touch. */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    const onDown = () => setActive(true)
    const onUp = () => setActive(false)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      className={`cursor ${active ? 'is-active' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden
    >
      <span className="cursor__ring" />
      <span className="cursor__dot" />
    </div>
  )
}
