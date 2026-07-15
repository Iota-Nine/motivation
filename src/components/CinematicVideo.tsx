import { useCallback, useEffect, useRef, useState } from 'react'
import { VolumeControl } from './VolumeControl'
import { EgoOverlay } from './EgoOverlay'
import { outroEgoLines } from '../data/egoLines'

const DEFAULT_VOL = 0.28

type Props = {
  src: string
  autoPlay?: boolean
  /** Optional narrator track timed to finish with the cut video end */
  narratorSrc?: string
  /** Stop this many seconds before the real end */
  cutEarlySeconds?: number
  onFinished: () => void
}

/** Fullscreen cinematic clip with end fade. No gate when autoPlay. */
export function CinematicVideo({
  src,
  autoPlay = false,
  narratorSrc,
  cutEarlySeconds = 0,
  onFinished,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const narratorRef = useRef<HTMLAudioElement | null>(null)
  const narratorStartedRef = useRef(false)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'fade'>(autoPlay ? 'playing' : 'idle')
  const [volume, setVolume] = useState(DEFAULT_VOL)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (!narratorSrc) return
    const audio = new Audio(narratorSrc)
    audio.preload = 'auto'
    audio.volume = volume
    narratorRef.current = audio
    audio.load()
    return () => {
      audio.pause()
      audio.src = ''
      narratorRef.current = null
    }
  }, [narratorSrc])

  useEffect(() => {
    const video = videoRef.current
    const narrator = narratorRef.current
    if (video) {
      // Duck video bed slightly once narrator is speaking
      video.volume = narratorStartedRef.current ? volume * 0.35 : volume
    }
    if (narrator) narrator.volume = volume
  }, [volume])

  const stopNarrator = useCallback(() => {
    const narrator = narratorRef.current
    if (!narrator) return
    narrator.pause()
    narrator.currentTime = 0
  }, [])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    const video = videoRef.current
    if (video) {
      video.pause()
      video.volume = 0
    }
    stopNarrator()
    setPhase('fade')
    window.setTimeout(() => onFinished(), 1400)
  }, [onFinished, stopNarrator])

  useEffect(() => {
    if (!autoPlay) return
    const video = videoRef.current
    if (!video) return
    video.volume = DEFAULT_VOL
    void video.play().catch(() => finish())
  }, [autoPlay, finish])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const maybeStartNarrator = () => {
      if (finishedRef.current || narratorStartedRef.current || !narratorSrc) return
      const narrator = narratorRef.current
      if (!narrator) return
      if (!video.duration || Number.isNaN(video.duration)) return
      if (!narrator.duration || Number.isNaN(narrator.duration)) return

      const cutAt = Math.max(cutEarlySeconds, 0)
      const effectiveEnd = Math.max(0, video.duration - cutAt)
      // Start mid-video if needed so narrator & video cut end together
      const startAt = Math.max(0, effectiveEnd - narrator.duration)

      if (video.currentTime + 0.05 >= startAt) {
        narratorStartedRef.current = true
        narrator.currentTime = 0
        narrator.volume = volume
        video.volume = volume * 0.35
        void narrator.play().catch(() => {
          /* ignore */
        })
      }
    }

    const onTime = () => {
      if (finishedRef.current) return
      if (!video.duration || Number.isNaN(video.duration)) return

      maybeStartNarrator()

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
    const onMeta = () => maybeStartNarrator()

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)
    video.addEventListener('loadedmetadata', onMeta)
    narratorRef.current?.addEventListener('loadedmetadata', onMeta)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      video.removeEventListener('loadedmetadata', onMeta)
      narratorRef.current?.removeEventListener('loadedmetadata', onMeta)
    }
  }, [cutEarlySeconds, finish, narratorSrc, phase, volume])

  return (
    <div className={`intro ${phase === 'fade' ? 'is-fade' : ''}`}>
      <div className="intro__bars" aria-hidden />
      <video
        ref={videoRef}
        className="intro__video"
        src={src}
        playsInline
        preload="auto"
      />
      <div className="intro__vignette" />
      <EgoOverlay active={phase === 'playing'} lines={outroEgoLines} />
      {phase !== 'fade' && (
        <VolumeControl value={volume} onChange={setVolume} />
      )}
    </div>
  )
}
