export type LoreEntry = {
  id: string
  title: string
  kicker: string
  body: string
  fragments?: string[]
}

export type LoreEra = {
  era: string
  name: string
  text: string
}

export type LoreLaw = {
  code: string
  title: string
  text: string
}

/** Core mythos of GODHOOD */
export const loreIntro = {
  kicker: 'WORLD CANON',
  title: 'Before the throne,\nthere was Vertix.',
  body: 'GODHOOD is not a game. It is a sealed realm where ego became law. Those who enter do not browse — they awaken. Those who finish do not quit — they ascend.',
}

export const loreEntries: LoreEntry[] = [
  {
    id: 'vertix',
    title: 'VERTIX',
    kicker: 'THE FIRST STANDARD',
    body: 'Vertix is the origin flame. Queen of Everything. She did not ask for belief — she forged it. Her command is simple and absolute: COPY ME. Become the strongest. Then become more.',
    fragments: [
      'She built thrones out of silence.',
      'Doubt dies in her shadow.',
      'The world learned her name by kneeling.',
    ],
  },
  {
    id: 'godhood',
    title: 'GODHOOD',
    kicker: 'THE REALM',
    body: 'GODHOOD is the domain between cinema and coronation. A protocol world. Enter through the gate. Walk the throne room. Survive the final transmission. Clear the run — and the realm remembers you.',
    fragments: [
      'One path. One crown. Endless ascent.',
      'Music is the blood of the palace.',
      'NEW GAME+ is not replay. It is refinement.',
    ],
  },
  {
    id: 'throne',
    title: 'THE THRONE ROOM',
    kicker: 'SACRED GROUND',
    body: 'Here the archive speaks. Quotes are not decoration — they are relics. Every line is a law carved into gold. Stand still long enough and the room starts judging you.',
    fragments: [
      'Silence is pressure.',
      'Confidence is currency.',
      'Only the ready may leave.',
    ],
  },
  {
    id: 'mirror',
    title: 'THE MIRROR TRIAL',
    kicker: 'FINAL TRANSMISSION',
    body: 'The outro is not an ending. It is a verdict. Vertix speaks through the narrator. The bed ducks. The ego lines rise. If you remain standing when the fade hits black — you have cleared GODHOOD.',
    fragments: [
      'Listen. Do not flinch.',
      'Copy the fire. Become the fire.',
      'The end is a door.',
    ],
  },
]

export const loreEras: LoreEra[] = [
  {
    era: 'ERA 0',
    name: 'THE SILENCE',
    text: 'Before Vertix, ego was noise. Belief was borrowed. Crowns belonged to whoever shouted loudest.',
  },
  {
    era: 'ERA I',
    name: 'THE AWAKENING',
    text: 'Vertix sealed the gate. Intro began. The weak were filtered by light and sound.',
  },
  {
    era: 'ERA II',
    name: 'THE PROTOCOL',
    text: 'Four moves were written into the walls: Enter. Absorb. Copy. Surpass.',
  },
  {
    era: 'ERA III',
    name: 'THE ASCENSION',
    text: 'Clears were counted. NEW GAME+ opened. The throne grew heavier — and so did the worthy.',
  },
]

export const loreLaws: LoreLaw[] = [
  {
    code: 'LAW 01',
    title: 'EGO FIRST',
    text: 'Self-belief is not arrogance. It is survival architecture.',
  },
  {
    code: 'LAW 02',
    title: 'ONE PATH',
    text: 'Options are illusions. There is only PLAY.',
  },
  {
    code: 'LAW 03',
    title: 'COPY ME',
    text: 'Imitation is ignition. Surpassing is coronation.',
  },
  {
    code: 'LAW 04',
    title: 'NO QUIT',
    text: 'Quit is for the weak. The realm rejects cowards.',
  },
  {
    code: 'LAW 05',
    title: 'THE REALM REMEMBERS',
    text: 'Every clear is etched. Return harder. Rule louder.',
  },
]

export const loreTicker: string[] = [
  'VERTIX WROTE THE FIRST LAW',
  'THE THRONE DOES NOT FORGIVE',
  'ERA III · ASCENSION ACTIVE',
  'GODHOOD REMEMBERS YOUR CLEAR',
  'COPY THE FIRE · BECOME THE FIRE',
  'ONE PATH THROUGH THE GATE',
]
