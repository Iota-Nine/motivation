import { useCallback, useEffect, useRef, useState } from 'react'
import { enterFullscreen } from '../lib/fullscreen'

type Props = {
  src: string
  onStart?: () => void
  onFinished: () => void
}

export function IntroVideo({ src, onStart, onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'gate' | 'playing' | 'fade'>('gate')
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('fade')
    window.setTimeout(() => onFinished(), 1400)
  }, [onFinished])

  const start = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    await enterFullscreen()
    onStart?.()
    setPhase('playing')
    try {
      video.currentTime = 0
      await video.play()
    } catch {
      finish()
    }
  }, [finish, onStart])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTime = () => {
      if (!video.duration || Number.isNaN(video.duration)) return
      const left = video.duration - video.currentTime
      if (left <= 1.35 && phase === 'playing') {
        setPhase('fade')
      }
    }

    const onEnded = () => finish()
    const onError = () => finish()

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
    }
  }, [finish, phase])

  return (
    <div className={`intro ${phase === 'fade' ? 'is-fade' : ''} ${phase === 'gate' ? 'is-gate' : ''}`}>
      <video
        ref={videoRef}
        className="intro__video"
        src={src}
        playsInline
        preload="auto"
      />

      {phase === 'gate' && (
        <button type="button" className="intro__enter" onClick={start}>
          <span className="intro__enter-rune">VERTIX</span>
          <span className="intro__enter-label">ENTER</span>
        </button>
      )}

      <div className="intro__vignette" />
    </div>
  )
}
