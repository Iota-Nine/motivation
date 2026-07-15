import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  autoPlay?: boolean
  onFinished: () => void
}

/** Fullscreen cinematic clip with end fade. No gate when autoPlay. */
export function CinematicVideo({ src, autoPlay = false, onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'fade'>(autoPlay ? 'playing' : 'idle')
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('fade')
    window.setTimeout(() => onFinished(), 1400)
  }, [onFinished])

  useEffect(() => {
    if (!autoPlay) return
    const video = videoRef.current
    if (!video) return
    void video.play().catch(() => finish())
  }, [autoPlay, finish])

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
