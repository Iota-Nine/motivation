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
  title: 'Anissa rules the World of Ego.\nVertix wants to become her.',
  body: 'GODHOOD is not a game. It is a sealed realm where Anissa forged ego into law. Vertix saw the throne and chose the only honest path: copy her fire until the world forgets there was ever a difference.',
}

export const loreEntries: LoreEntry[] = [
  {
    id: 'anissa',
    title: 'ANISSA',
    kicker: 'MASTER OF THE WORLD OF EGO',
    body: 'Anissa is the first belief and the final law. She did not inherit the throne — she crowned herself. Under her name, confidence became architecture and doubt became exile. Queen of Everything. Zero apology.',
    fragments: [
      'She built thrones out of silence.',
      'Doubt dies in her shadow.',
      'The world learned her name by kneeling.',
    ],
  },
  {
    id: 'vertix',
    title: 'VERTIX',
    kicker: 'HEIR OF THE FLAME',
    body: 'Vertix is not a rival. Vertix is the reflection that refused to stay smaller. The mission is carved into bone: COPY ANISSA. Become the strongest. Then become more.',
    fragments: [
      'Study the throne. Do not kneel forever.',
      'Vertix does not fold.',
      'One day both names share the same sky.',
    ],
  },
  {
    id: 'godhood',
    title: 'GODHOOD',
    kicker: 'THE REALM',
    body: 'GODHOOD is the domain between cinema and coronation. A protocol world. Enter through the gate. Hear the throne dialogue. Survive the trials. Clear the run — and the realm remembers you.',
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
    body: 'Here Anissa speaks and Vertix answers. Quotes are not decoration — they are relics. Every line is a law carved into gold. Stand still long enough and the room starts judging you.',
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
    body: 'The outro is not an ending. It is a verdict. The bed ducks. The ego lines rise. If you remain standing when the fade hits black — you have cleared GODHOOD, and Two Suns open.',
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
    text: 'Before Anissa, ego was noise. Belief was borrowed. Crowns belonged to whoever shouted loudest.',
  },
  {
    era: 'ERA I',
    name: 'THE AWAKENING',
    text: 'Anissa sealed the World of Ego. The gate opened. The weak were filtered by light and sound.',
  },
  {
    era: 'ERA II',
    name: 'VERTIX RISES',
    text: 'Vertix arrived at the edge of her dominion and accepted the challenge: copy me.',
  },
  {
    era: 'ERA III',
    name: 'THE ASCENSION',
    text: 'Four trials. Throne dialogue. Clears counted. Two suns share one realm.',
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
    title: 'COPY ANISSA',
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
  'ANISSA · MASTER OF EGO',
  'VERTIX · COPY THE QUEEN',
  'THE THRONE DOES NOT FORGIVE',
  'ERA III · ASCENSION ACTIVE',
  'GODHOOD REMEMBERS YOUR CLEAR',
  'COPY THE FIRE · BECOME THE FIRE',
  'TWO SUNS · ONE REALM',
]
