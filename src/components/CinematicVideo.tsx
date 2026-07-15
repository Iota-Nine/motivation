import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  autoPlay?: boolean
  /** Stop this many seconds before the real end */
  cutEarlySeconds?: number
  onFinished: () => void
}

/** Fullscreen cinematic clip with end fade. No gate when autoPlay. */
export function CinematicVideo({
  src,
  autoPlay = false,
  cutEarlySeconds = 0,
  onFinished,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'fade'>(autoPlay ? 'playing' : 'idle')
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

  useEffect(() => {
    if (!autoPlay) return
    const video = videoRef.current
    if (!video) return
    video.volume = 1
    void video.play().catch(() => finish())
  }, [autoPlay, finish])

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
    <div className={`intro ${phase === 'fade' ? 'is-fade' : ''}`}>
      <video
        ref={videoRef}
        className="intro__video"
        src={src}
        playsInline
        preload="auto"
      />
      <div className="intro__vignette" />
    </div>
  )
}
