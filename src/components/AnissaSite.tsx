import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  anissaClutches,
  anissaFacts,
  anissaLoreAnecdotes,
  anissaNav,
  anissaOtherGames,
  anissaPalmares,
  anissaProfile,
  anissaQuotes,
} from '../data/anissa'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onReplay: () => void
}

const HERO_IMG = '/assets/holograms/menu.png'

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

export function AnissaSite({ onReplay }: Props) {
  useEffect(() => {
    document.documentElement.classList.add('is-anissa-site')
    document.body.classList.add('is-anissa-site')
    window.scrollTo(0, 0)
    return () => {
      document.documentElement.classList.remove('is-anissa-site')
      document.body.classList.remove('is-anissa-site')
    }
  }, [])

  const scrollTo = (id: string) => {
    playUiSound('select')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const replay = () => {
    playUiSound('confirm')
    onReplay()
  }

  return (
    <div className="anissa">
      <header className="anissa__nav">
        <button type="button" className="anissa__logo" onClick={() => scrollTo('top')}>
          ANISSA
        </button>
        <nav className="anissa__links" aria-label="Anissa">
          {anissaNav.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className="anissa__ghost" onClick={replay}>
          Replay
        </button>
      </header>

      <section id="top" className="anissa-hero">
        <img src={HERO_IMG} alt="" className="anissa-hero__media" />
        <div className="anissa-hero__shade" />
        <motion.div
          className="anissa-hero__content"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="anissa-hero__brand">GODHOOD</p>
          <h1 className="anissa-hero__name">ANISSA</h1>
          <p className="anissa-hero__line">
            The strongest. The most beautiful. The queen above every lobby.
          </p>
          <div className="anissa-hero__cta">
            <button type="button" className="anissa__primary" onClick={() => scrollTo('about')}>
              Enter her world
            </button>
            <button type="button" className="anissa__text-btn" onClick={() => scrollTo('palmares')}>
              Immortal 3 →
            </button>
          </div>
        </motion.div>
      </section>

      <div className="anissa-strip" aria-hidden>
        <div className="anissa-strip__track">
          {[...anissaQuotes, ...anissaQuotes].map((q, i) => (
            <span key={`${q}-${i}`}>{q}</span>
          ))}
        </div>
      </div>

      <motion.section id="about" className="anissa-block" {...fade}>
        <p className="anissa-block__label">About</p>
        <h2 className="anissa-block__title">
          Not a player.
          <br />
          The standard.
        </h2>
        <p className="anissa-block__text">{anissaProfile.bio}</p>
        <p className="anissa-block__aside">{anissaProfile.creed}</p>
      </motion.section>

      <motion.section id="palmares" className="anissa-block anissa-block--rank" {...fade}>
        <p className="anissa-block__label">Palmarès</p>
        <p className="anissa-rank__game">Valorant</p>
        <h2 className="anissa-rank__big">Immortal 3</h2>
        <p className="anissa-block__text anissa-block__text--narrow">
          Peak of fear. Lobby opens, morale drops. Anissa does not climb ranks — ranks climb toward
          her.
        </p>
        <ul className="anissa-rank__list">
          {anissaPalmares.map((item) => (
            <li key={item.game}>
              <span>{item.game}</span>
              <strong>{item.rank}</strong>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section id="clutches" className="anissa-block" {...fade}>
        <p className="anissa-block__label">Clutches</p>
        <h2 className="anissa-block__title">Moments that ended arguments</h2>
        <ol className="anissa-story">
          {anissaClutches.map((clutch) => (
            <li key={clutch.id}>
              <div className="anissa-story__index">
                <span>{clutch.id}</span>
                <em>{clutch.game}</em>
              </div>
              <h3>{clutch.title}</h3>
              <p>{clutch.text}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section id="games" className="anissa-block anissa-block--split" {...fade}>
        <div>
          <p className="anissa-block__label">Games</p>
          <h2 className="anissa-block__title">
            Same crown.
            <br />
            Every server.
          </h2>
        </div>
        <ul className="anissa-plain">
          {anissaOtherGames.map((game) => (
            <li key={game.game}>
              <div>
                <h3>{game.game}</h3>
                <span>{game.role}</span>
              </div>
              <p>{game.text}</p>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section id="lore" className="anissa-block" {...fade}>
        <p className="anissa-block__label">Lore</p>
        <h2 className="anissa-block__title">How Anissa became Vertix</h2>
        <div className="anissa-lore-flow">
          {anissaLoreAnecdotes.map((item, i) => (
            <article key={item.title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section id="dossier" className="anissa-block anissa-block--end" {...fade}>
        <p className="anissa-block__label">Dossier</p>
        <h2 className="anissa-block__title">Official file</h2>
        <dl className="anissa-file">
          {anissaFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="anissa-endline">
          Inferiors study her.
          <br />
          Equals do not exist.
        </p>
        <button type="button" className="anissa__primary" onClick={replay}>
          Return to GODHOOD
        </button>
      </motion.section>

      <footer className="anissa__footer">
        <span>Anissa · Vertix · Godhood</span>
        <span>Immortal 3</span>
      </footer>
    </div>
  )
}
