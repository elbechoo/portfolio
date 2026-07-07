import { useLanguage } from '../context/LanguageContext'

const timeline = [
  { date: 'Feb 2026 — Jun 2026', company: 'INET · Sfax, Tunisia',                    titleKey: 'exp1Title', descKey: 'exp1Desc', tech: ['SQL Server 2022','Python 3.14','FastAPI','SQLAlchemy','Next.js','Power BI','Scikit-learn','BCrypt'], type: 'work' },
  { date: 'Nov 2024',            company: 'IEEE · AfroTech Intelligence Hackathon',   titleKey: 'exp2Title', descKey: 'exp2Desc', tech: ['Python','Machine Learning','Rapid Prototyping'],                                                       type: 'award' },
  { date: '2023 — 2026',         company: 'International School of Business · Sfax', titleKey: 'exp3Title', descKey: 'exp3Desc', tech: ['Power BI','Python','SQL','Data Warehousing','Machine Learning'],                                        type: 'edu' },
  { date: '2019 — 2023',         company: 'Lycée Monji Slim · Sfax',                 titleKey: 'exp4Title', descKey: 'exp4Desc', tech: [],                                                                                                       type: 'edu' },
]

const typeColors = { work: 'badge-lime', edu: 'badge-blue', award: 'badge-orange' }
const typeLabelKeys = { work: 'expWork', edu: 'expEdu', award: 'expAward' }

export default function Experience() {
  const { t } = useLanguage()
  return (
    <section id="experience" className="section">
      <div className="container">
        <p className="section-label">{t('expLabel')}</p>
        <h2 className="section-title">{t('expTitle')}</h2>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className={`timeline-item reveal reveal-delay-${(i % 3) + 1}`}>
              <div className="timeline-dot" />
              <div className="timeline-meta">
                <span className="timeline-date">{item.date}</span>
                <span className="timeline-company">· {item.company}</span>
                <span className={`badge ${typeColors[item.type]}`}>{t(typeLabelKeys[item.type])}</span>
              </div>
              <h3 className="timeline-title">{t(item.titleKey)}</h3>
              <p className="timeline-desc">{t(item.descKey)}</p>
              {item.tech.length > 0 && (
                <div className="timeline-tech">
                  {item.tech.map(tech => <span key={tech} className="tech-pill">{tech}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
