import { useEffect, useState } from 'react'

type Props = {
  clears: number
  newGamePlus?: boolean
  playing?: boolean
}

export function StatusHud({ clears, newGamePlus = false, playing = false }: Props) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return (
    <div className="status-hud" aria-hidden>
      <span className="status-hud__item">
        <em>SYS</em> {playing ? 'LIVE' : 'IDLE'}
      </span>
      <span className="status-hud__item">
        <em>CLK</em> {time}
      </span>
      <span className="status-hud__item">
        <em>CLR</em> {String(clears).padStart(2, '0')}
      </span>
      <span className={`status-hud__item ${newGamePlus ? 'is-hot' : ''}`}>
        <em>RUN</em> {newGamePlus ? 'NG+' : 'STD'}
      </span>
    </div>
  )
}
