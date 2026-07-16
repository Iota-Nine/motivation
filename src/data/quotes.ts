export type Quote = {
  text: string
}

export const quotes: Quote[] = [
  {
    text: "If you're not the first to believe in yourself, no one will.",
  },
  {
    text: 'Your ego is not a flaw. It is fuel.',
  },
  {
    text: 'Confidence is silent. Doubt is loud. Mute the noise.',
  },
  {
    text: 'Walk like you already won. Work like you still need to.',
  },
  {
    text: 'Nobody is coming to save your potential. That is on you.',
  },
  {
    text: 'Self belief is not arrogance. It is survival.',
  },
  {
    text: 'You either own your image or the world owns you.',
  },
  {
    text: 'Stop asking for permission to take up space.',
  },
  {
    text: 'Doubt them before you doubt yourself.',
  },
  {
    text: 'Your confidence decides how far your talent goes.',
  },
  {
    text: 'Be so sure of yourself that silence becomes pressure.',
  },
  {
    text: 'Ego builds kings. Fear builds followers.',
  },
  {
    text: 'Believe first. Prove it after.',
  },
  {
    text: 'You are the standard. Act like it.',
  },
]

/** Endless ticker lines. Ego throne protocol. */
export const tickerLines: string[] = [
  'VERTIX. COPY ME',
  'EGO ON. DOUBT OFF',
  'BECOME THE STRONGEST',
  'A WORLD UNDER YOUR CONTROL',
  'QUEEN ENERGY ONLY',
  'RISE LIKE ME',
  'BELIEVE FIRST. RULE AFTER',
  'THRONE MENTALITY',
  'NO SECOND PATH',
  'SELF BELIEF OR NOTHING',
  'VERTIX DOES NOT FOLD',
  'TAKE THE CROWN',
  'TOUCH THE GRACE',
  'GODHOOD AWAITS',
]

export function getQuoteOfTheDay(date = new Date()): Quote {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  return quotes[dayOfYear % quotes.length]
}
