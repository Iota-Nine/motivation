type Props = {
  value: number
  onChange: (value: number) => void
}

export function VolumeControl({ value, onChange }: Props) {
  const pct = Math.round(value * 100)

  return (
    <div className="vol" onClick={(e) => e.stopPropagation()}>
      <span className="vol__icon" aria-hidden>
        {value === 0 ? 'MUTE' : 'VOL'}
      </span>
      <input
        className="vol__range"
        type="range"
        min={0}
        max={100}
        value={pct}
        aria-label="Volume"
        onChange={(e) => onChange(Number(e.target.value) / 100)}
      />
      <span className="vol__pct">{pct}</span>
    </div>
  )
}
