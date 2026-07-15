import { tickerLines } from '../data/quotes'

type Props = {
  reverse?: boolean
}

export function TextTicker({ reverse = false }: Props) {
  const loop = [...tickerLines, ...tickerLines]

  return (
    <div className={`ticker ${reverse ? 'ticker--reverse' : ''}`} aria-hidden>
      <div className="ticker__track">
        {loop.map((line, i) => (
          <span key={`${line}-${i}`} className="ticker__item">
            {line}
            <span className="ticker__dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
