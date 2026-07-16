/** Lightweight Web Audio UI SFX — no asset files needed. */

type SfxKind = 'hover' | 'select' | 'deny' | 'confirm'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

export async function unlockUiSounds(): Promise<void> {
  const audio = getCtx()
  if (!audio) return
  if (audio.state === 'suspended') {
    try {
      await audio.resume()
    } catch {
      /* ignore */
    }
  }
}

function tone(
  audio: AudioContext,
  {
    freq,
    duration,
    type = 'triangle',
    gain = 0.08,
    slideTo,
  }: {
    freq: number
    duration: number
    type?: OscillatorType
    gain?: number
    slideTo?: number
  },
) {
  const now = audio.currentTime
  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  if (slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + duration)
  }
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

export function playUiSound(kind: SfxKind): void {
  const audio = getCtx()
  if (!audio || audio.state === 'suspended') {
    void unlockUiSounds()
    return
  }

  switch (kind) {
    case 'hover':
      tone(audio, { freq: 620, duration: 0.05, type: 'sine', gain: 0.035 })
      break
    case 'select':
      tone(audio, { freq: 420, duration: 0.08, type: 'triangle', gain: 0.07, slideTo: 680 })
      break
    case 'confirm':
      tone(audio, { freq: 380, duration: 0.12, type: 'triangle', gain: 0.09, slideTo: 720 })
      tone(audio, { freq: 760, duration: 0.16, type: 'sine', gain: 0.04 })
      break
    case 'deny':
      tone(audio, { freq: 220, duration: 0.18, type: 'sawtooth', gain: 0.045, slideTo: 90 })
      break
  }
}
