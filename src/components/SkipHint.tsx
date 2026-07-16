type Props = {
  visible: boolean
  onSkip: () => void
  label?: string
}

export function SkipHint({ visible, onSkip, label = 'SKIP' }: Props) {
  if (!visible) return null

  return (
    <button type="button" className="skip-hint" onClick={onSkip}>
      <span className="skip-hint__key">SPACE</span>
      <span className="skip-hint__label">{label}</span>
    </button>
  )
}
