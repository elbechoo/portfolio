import { useEffect, useState } from 'react'
import './site.css'
import Contact from './Contact'
import { content, LINKS, CERTS } from './content'

const LANGS = [['en', 'EN'], ['fr', 'FR'], ['ar', 'ع']]

function pickInitialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved && content[saved]) return saved
  } catch { /* storage can be blocked; fall through */ }
  const nav = (navigator.language || 'en').slice(0, 2)
  return content[nav] ? nav : 'en'
}

function Header({ c, lang, setLang }) {
  return (
    <header className="top">
      <div className="wrap top-in">
        <a className="brand" href="#top">Hachem Zenati</a>
        <nav className="top-nav" aria-label="Sections">
          <a href="#work">{c.nav.work}</a>
          <a href="#experience">{c.nav.experience}</a>
          <a href="#contact">{c.nav.contact}</a>
        </nav>
        <div className="langs" role="group" aria-label="Language">
          {LANGS.map(([code, label]) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

function Hero({ c }) {
  const h = c.hero
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <img className="portrait" src="/profile.jpg" alt="Hachem Zenati" width="132" height="132" />
        <div>
          <p className="kicker">{h.role}</p>
          <h1>{h.lead}</h1>
          <p className="hero-sub">{h.sub}</p>
          <p className="now"><span className="now-label">{h.nowLabel}</span>{h.now}</p>
          <div className="hero-actions">
            <a className="btn" href={LINKS.cvEn} target="_blank" rel="noopener">{h.cvEn}</a>
            <a className="btn btn-quiet" href={LINKS.cvFr} target="_blank" rel="noopener">{h.cvFr}</a>
            <a className="plain" href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHead({ id, label, title }) {
  return (
    <div className="row head">
      <p className="label" id={`${id}-label`}>{label}</p>
      <h2>{title}</h2>
    </div>
  )
}

function Work({ c }) {
  const w = c.work
  return (
    <section id="work" aria-labelledby="work-label">
      <div className="wrap">
        <SectionHead id="work" label={w.label} title={w.title} />
        {w.items.map((p) => (
          <article className="row project" key={p.key}>
            <div className="meta">
              <span className="year">{p.year}</span>
              <ul className="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div>
              <h3>{p.name}</h3>
              {p.live && <p className="live">{w.liveNote}</p>}
              <p className="question">{p.question}</p>
              <p className="body">{p.body}</p>
              <ul className="facts">{p.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              <p className="links">
                {p.links.map(([kind, href]) => (
                  <a key={kind} href={href} target="_blank" rel="noopener">{w[kind]}</a>
                ))}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Timeline({ items, label }) {
  return (
    <div className="row timeline">
      <p className="label sub">{label}</p>
      <ol>
        {items.map((it) => (
          <li key={it.when + it.role}>
            <span className="when">{it.when}</span>
            <div>
              <p className="what"><strong>{it.org}</strong>, {it.role}</p>
              {it.note && <p className="note">{it.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Experience({ c }) {
  const e = c.exp
  return (
    <section id="experience" aria-labelledby="experience-label">
      <div className="wrap">
        <SectionHead id="experience" label={e.label} title={e.title} />
        <Timeline items={e.jobs} label={e.jobsLabel} />
        <Timeline items={e.edu} label={e.eduLabel} />
        <Timeline items={e.awards} label={e.awardsLabel} />
      </div>
    </section>
  )
}

function Toolkit({ c }) {
  const t = c.tools
  return (
    <section id="toolkit" aria-labelledby="toolkit-label">
      <div className="wrap">
        <SectionHead id="toolkit" label={t.label} title={t.title} />
        <div className="row">
          <span />
          <div className="tool-groups">
            {t.groups.map(([name, items]) => (
              <div key={name}>
                <p className="group-name">{name}</p>
                <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="row">
          <p className="label sub">{t.langLabel}</p>
          <p className="langs-line">{t.langs}</p>
        </div>
        <div className="row">
          <p className="label sub">{t.certLabel}</p>
          <ul className="certs">
            {CERTS.map((k) => (
              <li key={k.name}>
                <a href={k.url} target="_blank" rel="noopener">{k.name}</a>
                <span className="by">{k.by}</span>
                <span className="when">{k.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState(pickInitialLang)
  const c = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = c.dir
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang, c.dir])

  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <Header c={c} lang={lang} setLang={setLang} />
      <main>
        <Hero c={c} />
        <Work c={c} />
        <Experience c={c} />
        <Toolkit c={c} />
        <Contact c={c} lang={lang} />
      </main>
      <footer className="foot"><div className="wrap">{c.foot}</div></footer>
    </>
  )
}
