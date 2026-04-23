import { useLanguage } from '../context/LanguageContext'

const awards = [
  { icon: '🥉', year: '2025', org: 'IEEE',     title: 'AfroTech Intelligence Hackathon', descKey: 'award1Desc' },
  { icon: '🤖', year: '2025', org: 'IEEE RAS', title: 'Pyrabot IEEE Competition',        descKey: 'award2Desc' },
]

export default function Awards() {
  const { t } = useLanguage()
  return (
    <section id="awards" className="section">
      <div className="container">
        <p className="section-label">{t('awardsLabel')}</p>
        <h2 className="section-title">{t('awardsTitle')}</h2>
        <div className="awards-grid">
          {awards.map((a, i) => (
            <div key={i} className={`award-card reveal reveal-delay-${i + 1}`}>
              <div className="award-card-top">
                <span className="award-icon">{a.icon}</span>
                <div>
                  <p className="award-org">{a.year} · {a.org}</p>
                </div>
              </div>
              <h3 className="award-title">{a.title}</h3>
              <p className="award-desc">{t(a.descKey)}</p>
              <span className="badge badge-lime">{t('awardPlace')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
