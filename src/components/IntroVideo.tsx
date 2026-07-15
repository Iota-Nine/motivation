import { useCallback, useEffect, useRef, useState } from 'react'
import { forceFullscreen } from '../lib/fullscreen'
import { VolumeControl } from './VolumeControl'
import { EgoOverlay } from './EgoOverlay'
import { introEgoLines } from '../data/egoLines'

const DEFAULT_VOL = 0.28

type Props = {
  src: string
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
  const rootRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'gate' | 'playing' | 'fade'>('gate')
  const [volume, setVolume] = useState(DEFAULT_VOL)
  const finishedRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) video.volume = volume
  }, [volume])

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

  const start = useCallback(
    (event?: React.SyntheticEvent) => {
      event?.preventDefault()
      event?.stopPropagation()

      const video = videoRef.current
      if (!video || startedRef.current) return
      startedRef.current = true

      // Sync call in the click stack — do not await before this
      forceFullscreen(rootRef.current ?? video)

      onStart?.()
      setPhase('playing')

      video.currentTime = 0
      video.volume = volume
      void video.play().catch(() => finish())

      window.setTimeout(() => {
        forceFullscreen(document.documentElement)
      }, 50)
    },
    [finish, onStart, volume],
  )

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
    <div
      ref={rootRef}
      className={`intro ${phase === 'fade' ? 'is-fade' : ''} ${phase === 'gate' ? 'is-gate' : ''}`}
    >
      <div className="intro__bars" aria-hidden />
      <video
        ref={videoRef}
        className="intro__video"
        src={src}
        playsInline
        preload="auto"
      />

      <div className="intro__dim" />
      <div className="intro__vignette" />

      <EgoOverlay active={phase === 'playing'} lines={introEgoLines} />

      {phase === 'gate' && (
        <button
          type="button"
          className="intro__enter"
          onPointerDown={start}
          onClick={start}
        >
          <span className="intro__enter-rune">GODHOOD</span>
          <span className="intro__enter-label">ENTER</span>
        </button>
      )}

      {phase !== 'fade' && (
        <VolumeControl value={volume} onChange={setVolume} />
      )}
    </div>
  )
}
