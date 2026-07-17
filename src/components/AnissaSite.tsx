import { useEffect } from 'react'
import {
  anissaClutches,
  anissaFacts,
  anissaLoreAnecdotes,
  anissaNav,
  anissaOtherGames,
  anissaPalmares,
  anissaProfile,
  anissaQuotes,
  anissaStats,
} from '../data/anissa'
import { playUiSound } from '../lib/uiSounds'

type Props = {
  onReplay: () => void
}

export function AnissaSite({ onReplay }: Props) {
  useEffect(() => {
    document.documentElement.classList.add('is-anissa-site')
    document.body.classList.add('is-anissa-site')
    return () => {
      document.documentElement.classList.remove('is-anissa-site')
      document.body.classList.remove('is-anissa-site')
    }
  }, [])

  const scrollTo = (id: string) => {
    playUiSound('select')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="anissa-site">
      <div className="anissa-site__bg" aria-hidden>
        <div className="anissa-site__glow anissa-site__glow--a" />
        <div className="anissa-site__glow anissa-site__glow--b" />
        <div className="anissa-site__grain" />
      </div>

      <header className="anissa-top">
        <div className="anissa-top__brand">
          <span>GODHOOD</span>
          <strong>ANISSA</strong>
        </div>
        <nav className="anissa-top__nav" aria-label="Anissa site">
          {anissaNav.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="anissa-top__replay"
          onClick={() => {
            playUiSound('confirm')
            onReplay()
          }}
        >
          REPLAY GODHOOD
        </button>
      </header>

      <section className="anissa-hero">
        <p className="anissa-hero__kicker">THE LIVING STANDARD · VERTIX INCARNATE</p>
        <h1 className="anissa-hero__name">{anissaProfile.name}</h1>
        <p className="anissa-hero__title">{anissaProfile.title}</p>
        <p className="anissa-hero__tag">{anissaProfile.tagline}</p>
        <div className="anissa-hero__stats">
          {anissaStats.map((stat) => (
            <div key={stat.label} className="anissa-hero__stat">
              <em>{stat.label}</em>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
        <p className="anissa-hero__creed">{anissaProfile.creed}</p>
      </section>

      <div className="anissa-marquee" aria-hidden>
        <div className="anissa-marquee__track">
          {[...anissaQuotes, ...anissaQuotes].map((q, i) => (
            <span key={`${q}-${i}`}>
              {q}
              <i />
            </span>
          ))}
        </div>
      </div>

      <section id="about" className="anissa-section">
        <p className="anissa-section__eyebrow">ABOUT</p>
        <h2 className="anissa-section__title">Everything to know about Anissa</h2>
        <p className="anissa-section__lead">{anissaProfile.bio}</p>
        <div className="anissa-about-grid">
          <article>
            <h3>THE QUEEN</h3>
            <p>
              Beauty that silences rooms. Presence that rearranges hierarchies. Anissa does not
              compete for attention — attention reports to her.
            </p>
          </article>
          <article>
            <h3>THE STRONGEST</h3>
            <p>
              Immortal 3 Valorant. Aim that looks unfair. Mental that never folds. She is not
              &quot;good for a lobby.&quot; She is the reason the lobby exists.
            </p>
          </article>
          <article>
            <h3>THE MYTH</h3>
            <p>
              Alias Vertix. Face of GODHOOD. Proof that ego can be elegant, lethal, and absolute
              at the same time.
            </p>
          </article>
        </div>
      </section>

      <section id="palmares" className="anissa-section">
        <p className="anissa-section__eyebrow">PALMARÈS</p>
        <h2 className="anissa-section__title">Trophy room of a monarch</h2>
        <ul className="anissa-palmares">
          {anissaPalmares.map((item) => (
            <li key={item.game}>
              <div>
                <p className="anissa-palmares__game">{item.game}</p>
                <p className="anissa-palmares__rank">{item.rank}</p>
              </div>
              <p className="anissa-palmares__note">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="clutches" className="anissa-section">
        <p className="anissa-section__eyebrow">CLUTCH ARCHIVE</p>
        <h2 className="anissa-section__title">Moments that rewrote the match</h2>
        <div className="anissa-clutches">
          {anissaClutches.map((clutch) => (
            <article key={clutch.id} className="anissa-clutch">
              <div className="anissa-clutch__meta">
                <span>{clutch.id}</span>
                <em>{clutch.game}</em>
              </div>
              <h3>{clutch.title}</h3>
              <p>{clutch.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="games" className="anissa-section">
        <p className="anissa-section__eyebrow">OTHER GAMES</p>
        <h2 className="anissa-section__title">Same queen. Every server.</h2>
        <div className="anissa-games">
          {anissaOtherGames.map((game) => (
            <article key={game.game}>
              <p className="anissa-games__name">{game.game}</p>
              <p className="anissa-games__role">{game.role}</p>
              <p>{game.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="lore" className="anissa-section">
        <p className="anissa-section__eyebrow">LORE ANECDOTES</p>
        <h2 className="anissa-section__title">How Anissa became Vertix</h2>
        <div className="anissa-lore">
          {anissaLoreAnecdotes.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="dossier" className="anissa-section anissa-section--dossier">
        <p className="anissa-section__eyebrow">DOSSIER</p>
        <h2 className="anissa-section__title">Official file</h2>
        <dl className="anissa-dossier">
          {anissaFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <blockquote className="anissa-final">
          Inferiors study her. Equals do not exist. Anissa remains the crown.
        </blockquote>
        <button
          type="button"
          className="anissa-final-cta"
          onClick={() => {
            playUiSound('confirm')
            onReplay()
          }}
        >
          RETURN TO GODHOOD
        </button>
      </section>

      <footer className="anissa-foot">
        <span>ANISSA / VERTIX / GODHOOD</span>
        <span>IMMORTAL 3 · QUEEN PROTOCOL</span>
        <span>ALL HAIL THE STRONGEST</span>
      </footer>
    </div>
  )
}
