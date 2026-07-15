type Props = {
  playing: boolean
  missing: boolean
  onToggle: () => void
}

export function AudioDock({ playing, missing, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`audio-dock ${playing ? 'is-playing' : ''} ${missing ? 'is-missing' : ''}`}
      onClick={onToggle}
      disabled={missing}
      aria-label={playing ? 'Pause music' : 'Play music'}
    >
      <span className="audio-dock__bars" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="audio-dock__label">
        {missing ? 'ADD MUSIC' : playing ? 'MUTE' : 'SOUND'}
      </span>
    </button>
  )
}
