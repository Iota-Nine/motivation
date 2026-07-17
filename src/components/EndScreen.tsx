import { useCallback, useState } from 'react'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  clears: number
  onContinue: () => void
}

const SHARE_TEXT = 'I entered GODHOOD and met the queen: Anissa. Copy her. Become the strongest.'

export function EndScreen({ clears, onContinue }: Props) {
  const [shareNote, setShareNote] = useState<string | null>(null)
  const ngPlus = clears > 0

  const share = useCallback(async () => {
    playUiSound('select')
    const url = window.location.href
    const payload = { title: 'GODHOOD · ANISSA', text: SHARE_TEXT, url }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        setShareNote('SHARED.')
        return
      }
    } catch {
      /* cancelled */
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
      <div className="the-end__aurora" aria-hidden />
      <div className="the-end__panel">
        <p className="the-end__kicker">{ngPlus ? `CLEAR ×${clears}` : 'CLEAR'}</p>
        <h2 className="the-end__brand">GODHOOD</h2>
        <button
          type="button"
          className="the-end__btn"
          onClick={() => {
            playUiSound('confirm')
            onContinue()
          }}
        >
          <span className="the-end__title">THE END</span>
          <span className="the-end__sub">REVEAL THE QUEEN</span>
          <span className="the-end__cta">PRESS TO ENTER ANISSA · FULL SITE</span>
        </button>

        <div className="the-end__row">
          <button type="button" className="the-end__share" onClick={() => void share()}>
            SHARE THE THRONE
          </button>
        </div>
        {shareNote && <p className="the-end__share-note">{shareNote}</p>}
        <p className="the-end__foot">THE REALM OPENS · ALL HAIL ANISSA</p>
      </div>
    </div>
  )
}
