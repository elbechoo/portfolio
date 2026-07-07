import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  const proficiencies = [
    { labelKey: 'prof1', pct: 92 },
    { labelKey: 'prof2', pct: 85 },
    { labelKey: 'prof3', pct: 88 },
    { labelKey: 'prof4', pct: 72 },
    { labelKey: 'prof5', pct: 70 },
  ]

  const infoItems = [
    { labelKey: 'infoLocation', val: 'Sfax, Tunisia 🇹🇳' },
    { labelKey: 'infoDegree',   val: 'Licence BI & Data Analytics' },
    { labelKey: 'infoSchool',   val: 'Intl. School of Business' },
    { labelKey: 'infoLanguages', valKey: 'langValue' },
    { labelKey: 'infoGitHub',   val: 'github.com/elbechoo' },
    { labelKey: 'infoPhone',    val: '+21892607261' },
  ]

  const langChips = [
    { lang: 'Arabic',  levelKey: 'langNative' },
    { lang: 'French',  levelKey: 'langUpperInt' },
    { lang: 'English', levelKey: 'langUpperInt' },
  ]

  const compKeys = ['comp1','comp2','comp3','comp4','comp5','comp6']

  return (
    <section id="about" className="section">
      <div className="container">
        <p className="section-label">{t('aboutLabel')}</p>
        <h2 className="section-title">{t('aboutTitle')}</h2>

        <div className="about-grid">
          <div className="about-text reveal">
            <p>{t('aboutBio1')}</p>
            <p>{t('aboutBio2')}</p>
            <p>{t('aboutBio3')}</p>

            <div className="about-info-grid">
              {infoItems.map((item) => (
                <div key={item.labelKey} className="about-info-item">
                  <p className="about-info-label">{t(item.labelKey)}</p>
                  <p className="about-info-val">{item.valKey ? t(item.valKey) : item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual reveal reveal-delay-2">
            <div className="about-vis-card">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 20, letterSpacing: 2 }}>
                {t('profTitle')}
              </p>
              {proficiencies.map((p, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div className="about-vis-label">
                    <span style={{ color: 'var(--gray-light)' }}>{t(p.labelKey)}</span>
                    <span>{p.pct}%</span>
                  </div>
                  <div className="about-vis-bar-wrap">
                    <div className="about-vis-bar" style={{ width: `${p.pct}%`, animationDelay: `${i * 0.15}s` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="about-vis-card">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray)', marginBottom: 12, letterSpacing: 2 }}>
                {t('langsTitle')}
              </p>
              <div className="lang-grid">
                {langChips.map(({ lang, levelKey }) => (
                  <div key={lang} className="lang-chip">
                    {lang} — <span>{t(levelKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-vis-card" style={{ borderColor: 'rgba(245,158,11,.12)', background: 'rgba(245,158,11,.03)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginBottom: 12, letterSpacing: 2 }}>
                {t('compsTitle')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {compKeys.map(k => (
                  <span key={k} className="badge badge-lime">{t(k)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
