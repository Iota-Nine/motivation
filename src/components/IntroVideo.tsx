import { useCallback, useEffect, useRef, useState } from 'react'
import { forceFullscreen } from '../lib/fullscreen'
import { VolumeControl } from './VolumeControl'
import { EgoOverlay } from './EgoOverlay'
import { SkipHint } from './SkipHint'
import { introEgoLines, introEgoLinesPlus } from '../data/egoLines'

const DEFAULT_VOL = 0.28

type Props = {
  src: string
  cutEarlySeconds?: number
  newGamePlus?: boolean
  onStart?: () => void
  onFinished: () => void
}

export function IntroVideo({
  src,
  cutEarlySeconds = 0,
  newGamePlus = false,
  onStart,
  onFinished,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [phase, setPhase] = useState<'gate' | 'playing' | 'fade'>('gate')
  const [volume, setVolume] = useState(DEFAULT_VOL)
  const [canSkip, setCanSkip] = useState(false)
  const finishedRef = useRef(false)
  const startedRef = useRef(false)
  const lines = newGamePlus ? introEgoLinesPlus : introEgoLines

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
    if (phase !== 'playing') return
    const id = window.setTimeout(() => setCanSkip(true), 1800)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing' || !canSkip) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Escape') {
        e.preventDefault()
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canSkip, finish, phase])

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

      <EgoOverlay active={phase === 'playing'} lines={lines} />

      {phase === 'gate' && (
        <button
          type="button"
          className="intro__enter"
          onPointerDown={start}
          onClick={start}
        >
          <span className="intro__enter-rune">GODHOOD</span>
          <span className="intro__enter-label">
            {newGamePlus ? 'ENTER · NEW GAME+' : 'ENTER'}
          </span>
        </button>
      )}

      <SkipHint visible={phase === 'playing' && canSkip} onSkip={finish} />

      {phase !== 'fade' && (
        <VolumeControl value={volume} onChange={setVolume} />
      )}
    </div>
  )
}
