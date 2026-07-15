import { useCallback, useEffect, useRef, useState } from 'react'

const MUSIC_SRC = '/assets/music.mp3'

type Options = {
  onEnded?: () => void
}

export function useAudio(options: Options = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const onEndedRef = useRef(options.onEnded)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    onEndedRef.current = options.onEnded
  }, [options.onEnded])

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = false
    audio.volume = 0.5
    audio.preload = 'auto'
    audioRef.current = audio

    const onCanPlay = () => setReady(true)
    const onError = () => setMissing(true)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      onEndedRef.current?.()
    }

    audio.addEventListener('canplaythrough', onCanPlay)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    audio.load()

    return () => {
      audio.pause()
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  const unlock = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || missing) return
    try {
      audio.volume = 0
      await audio.play()
      audio.pause()
      audio.currentTime = 0
      audio.volume = 0.5
    } catch {
      /* ignore */
    }
  }, [missing])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || missing) return
    try {
      audio.volume = 0.5
      await audio.play()
    } catch {
      /* blocked */
    }
  }, [missing])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || missing) return
    if (audio.paused) {
      await play()
    } else {
      audio.pause()
    }
  }, [missing, play])

  return { playing, ready, missing, unlock, play, stop, toggle }
}
