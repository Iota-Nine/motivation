import { useCallback, useState } from 'react'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  clears: number
  onRestart: () => void
}

const SHARE_TEXT = 'I entered GODHOOD. Copy me. Become the strongest.'

export function EndScreen({ clears, onRestart }: Props) {
  const [shareNote, setShareNote] = useState<string | null>(null)
  const ngPlus = clears > 0

  const share = useCallback(async () => {
    playUiSound('select')
    const url = window.location.href
    const payload = { title: 'GODHOOD', text: SHARE_TEXT, url }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        setShareNote('SHARED.')
        return
      }
    } catch {
      /* user cancelled or failed — fall through to clipboard */
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${url}`)
      setShareNote('LINK COPIED.')
    } catch {
      setShareNote('COPY FAILED. SHARE MANUALLY.')
    }

    window.setTimeout(() => setShareNote(null), 2200)
  }, [])

  return (
    <div className="the-end">
      <div className="the-end__panel">
        <p className="the-end__kicker">{ngPlus ? `CLEAR ×${clears}` : 'CLEAR'}</p>
        <button
          type="button"
          className="the-end__btn"
          onClick={() => {
            playUiSound('confirm')
            onRestart()
          }}
        >
          <span className="the-end__title">THE END</span>
          <span className="the-end__sub">GODHOOD</span>
          <span className="the-end__cta">
            {ngPlus ? 'NEW GAME+ · PRESS TO CONTINUE' : 'PRESS TO CONTINUE · NEW GAME+'}
          </span>
        </button>

        <button type="button" className="the-end__share" onClick={() => void share()}>
          SHARE THE THRONE
        </button>
        {shareNote && <p className="the-end__share-note">{shareNote}</p>}
      </div>
    </div>
  )
}
