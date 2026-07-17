export type Speaker = 'anissa' | 'vertix' | 'narrator'

export type DialogueLine = {
  speaker: Speaker
  text: string
}

export type DialogueScene = {
  id: string
  title: string
  setting: string
  lines: DialogueLine[]
}

export const throneDialogue: DialogueScene = {
  id: 'throne-audience',
  title: 'THE THRONE AUDIENCE',
  setting: 'Hall of Mirrors · World of Ego',
  lines: [
    {
      speaker: 'narrator',
      text: 'Vertix stands at the foot of the throne. Anissa does not rise. She never needs to.',
    },
    {
      speaker: 'anissa',
      text: 'You climbed this far. Most break at the first reflection. Speak.',
    },
    {
      speaker: 'vertix',
      text: 'I did not come to worship. I came to copy you — until the copy becomes a second sun.',
    },
    {
      speaker: 'anissa',
      text: 'Dangerous. Honest. The realm only opens for those who refuse to stay smaller.',
    },
    {
      speaker: 'vertix',
      text: 'Then open it. Put me through whatever burns the weak. I will not fold.',
    },
    {
      speaker: 'anissa',
      text: 'Four trials. Silence. Ego. Shadow. Crown. Fail one, and you were never meant for GODHOOD.',
    },
    {
      speaker: 'vertix',
      text: 'I already chose. Become you. Then become more.',
    },
    {
      speaker: 'anissa',
      text: 'Good. Then stop talking like a pilgrim… and start walking like a queen.',
    },
    {
      speaker: 'narrator',
      text: 'The mirrors tilt. The path of ascension ignites beneath Vertix’s feet.',
    },
  ],
}

export const speakerLabel: Record<Speaker, string> = {
  anissa: 'ANISSA',
  vertix: 'VERTIX',
  narrator: 'CHRONICLE',
}
