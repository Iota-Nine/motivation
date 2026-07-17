export type TrialChoice = {
  id: string
  label: string
  /** true = ego path that advances Vertix */
  correct: boolean
  reaction: string
}

export type Trial = {
  id: string
  rune: string
  title: string
  prompt: string
  choices: TrialChoice[]
}

export const trials: Trial[] = [
  {
    id: 'silence',
    rune: 'I',
    title: 'TRIAL OF SILENCE',
    prompt:
      'The crowd doubts Vertix. Their noise fills the hall. What does the heir do?',
    choices: [
      {
        id: 'explain',
        label: 'EXPLAIN YOURSELF',
        correct: false,
        reaction: 'Explanation is a leash. Anissa never begged the room to understand.',
      },
      {
        id: 'silence',
        label: 'HOLD THE SILENCE',
        correct: true,
        reaction: 'Silence becomes pressure. The hall bends first.',
      },
      {
        id: 'apologize',
        label: 'APOLOGIZE AND WAIT',
        correct: false,
        reaction: 'Apology is exile in the World of Ego. The mirrors go dark.',
      },
    ],
  },
  {
    id: 'ego',
    rune: 'II',
    title: 'TRIAL OF EGO',
    prompt:
      'A voice offers Vertix a softer throne — power without becoming Anissa. What is the answer?',
    choices: [
      {
        id: 'accept-soft',
        label: 'TAKE THE SOFTER THRONE',
        correct: false,
        reaction: 'Comfort is a counterfeit crown. GODHOOD rejects it.',
      },
      {
        id: 'copy-fire',
        label: 'COPY THE FIRE',
        correct: true,
        reaction: 'Vertix swallows the standard whole. The ego ignites gold.',
      },
      {
        id: 'reject-all',
        label: 'REJECT ALL POWER',
        correct: false,
        reaction: 'False humility is still fear. The path closes.',
      },
    ],
  },
  {
    id: 'shadow',
    rune: 'III',
    title: 'TRIAL OF SHADOW',
    prompt:
      'Anissa’s silhouette towers over Vertix. Standing in her shadow feels endless. What next?',
    choices: [
      {
        id: 'kneel',
        label: 'KNEEL FOREVER',
        correct: false,
        reaction: 'Worship freezes the climb. Heirs do not kneel forever.',
      },
      {
        id: 'flee',
        label: 'FLEE THE COMPARISON',
        correct: false,
        reaction: 'Running from her image is running from yourself.',
      },
      {
        id: 'enter',
        label: 'ENTER THE SHADOW',
        correct: true,
        reaction: 'Vertix steps into her silhouette — then stretches beyond it.',
      },
    ],
  },
  {
    id: 'crown',
    rune: 'IV',
    title: 'TRIAL OF THE CROWN',
    prompt:
      'The crown appears. Anissa watches. One choice remains before GODHOOD opens.',
    choices: [
      {
        id: 'ask',
        label: 'ASK FOR PERMISSION',
        correct: false,
        reaction: 'Permission is for the ruled. Queens take the weight.',
      },
      {
        id: 'claim',
        label: 'CLAIM THE ASCENT',
        correct: true,
        reaction: 'Vertix claims the path. Anissa smiles like a second storm.',
      },
      {
        id: 'share-doubt',
        label: 'DOUBT AT THE LAST STEP',
        correct: false,
        reaction: 'Doubt at the summit is still defeat. The crown vanishes.',
      },
    ],
  },
]

export const ascensionComplete = {
  title: 'ASCENSION UNLOCKED',
  lead: 'The four trials answer as one.',
  body: 'Vertix has copied the fire without becoming a servant of it. Anissa’s law stands: become me — then become more. The cinematic path is open.',
}
