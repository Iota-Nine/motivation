export type Quote = {
  text: string
}

export const quotes: Quote[] = [
  {
    text: "If you're not the first to believe in yourself, no one will.",
  },
  {
    text: "Your ego is not a flaw. It is fuel.",
  },
  {
    text: "Confidence is silent. Doubt is loud. Mute the noise.",
  },
  {
    text: "Walk like you already won. Work like you still need to.",
  },
  {
    text: "Nobody is coming to save your potential. That is on you.",
  },
  {
    text: "Self belief is not arrogance. It is survival.",
  },
  {
    text: "You either own your image or the world owns you.",
  },
  {
    text: "Stop asking for permission to take up space.",
  },
  {
    text: "Doubt them before you doubt yourself.",
  },
  {
    text: "Your confidence decides how far your talent goes.",
  },
  {
    text: "Be so sure of yourself that silence becomes pressure.",
  },
  {
    text: "Ego builds kings. Fear builds followers.",
  },
  {
    text: "Believe first. Prove it after.",
  },
  {
    text: "You are the standard. Act like it.",
  },
  {
    text: "Soft minds stay followers. Sharp egos take thrones.",
  },
  {
    text: "Make your presence expensive.",
  },
  {
    text: "The mirror is not your enemy. Your hesitation is.",
  },
]

/** Endless ticker lines. Ego throne protocol. */
export const tickerLines: string[] = [
  'ANISSA · MASTER OF EGO',
  'VERTIX · COPY THE QUEEN',
  'EGO ON. DOUBT OFF',
  'BECOME THE STRONGEST',
  'SILENCE · EGO · SHADOW · CROWN',
  'QUEEN ENERGY ONLY',
  'TWO SUNS · ONE REALM',
  'BELIEVE FIRST. RULE AFTER',
  'THRONE MENTALITY',
  'NO SECOND PATH',
  'VERTIX DOES NOT FOLD',
  'TAKE THE CROWN',
  'THE THRONE DOES NOT FORGIVE',
  'ERA III · ASCENSION ACTIVE',
  'GODHOOD REMEMBERS YOUR CLEAR',
  'COPY THE FIRE · BECOME THE FIRE',
]

export function getQuoteOfTheDay(date = new Date()): Quote {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  return quotes[dayOfYear % quotes.length]
}
