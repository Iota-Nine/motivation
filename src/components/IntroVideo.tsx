import { useCallback, useEffect, useRef, useState } from 'react'
import { enterFullscreen } from '../lib/fullscreen'

type Props = {
  src: string
  /** Stop this many seconds before the real end */
  cutEarlySeconds?: number
  onStart?: () => void
  onFinished: () => void
}

export function IntroVideo({
  src,
  cutEarlySeconds = 0,
  onStart,
  onFinished,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'gate' | 'playing' | 'fade'>('gate')
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    const video = videoRef.current
    if (video) {
      video.pause()
      video.volume = 0
    }
    setPhase('fade')
    window.setTimeout(() => onFinished(), 1400)
  }, [onFinished])

  const start = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    // Force fullscreen (browser F11 equivalent) on the same user click
    await enterFullscreen(document.documentElement)
    onStart?.()
    setPhase('playing')
    try {
      video.currentTime = 0
      video.volume = 1
      await video.play()
      // Retry once if the first request was ignored by the browser
      if (!document.fullscreenElement) {
        await enterFullscreen(document.documentElement)
      }
    } catch {
      finish()
    }
  }, [finish, onStart])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTime = () => {
      if (finishedRef.current) return
      if (!video.duration || Number.isNaN(video.duration)) return
      const left = video.duration - video.currentTime
      const cutAt = Math.max(cutEarlySeconds, 0)
      if (left <= cutAt + 1.35 && phase === 'playing') {
        setPhase('fade')
      }
      if (left <= cutAt) {
        finish()
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
  }, [cutEarlySeconds, finish, phase])

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
