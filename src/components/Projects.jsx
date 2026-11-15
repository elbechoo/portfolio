import { useLanguage } from '../context/LanguageContext'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const projects = [
  { num: '01', title: 'Apex Data \u00B7 F1 Analytics Warehouse', descKey: 'proj1Desc',
    github: 'https://github.com/elbechoo/f1-analytics',
    live:   'https://elbechoo.github.io/f1-analytics/',
    status: 'live', tech: ['dbt','DuckDB','Python','SQL','GitHub Actions'] },
  { num: '02', title: 'iNET RH \u00B7 HR Analytics Platform', descKey: 'proj2Desc',
    github: 'https://github.com/elbechoo/inet-rh-analytics',
    status: 'live', tech: ['dbt','PostgreSQL','Power BI','FastAPI','Scikit-learn'] },
  { num: '03', title: 'Retail Intelligence Platform', descKey: 'proj3Desc',
    github: 'https://github.com/elbechoo/retail-intelligence-platform',
    status: 'live', tech: ['dbt','DuckDB','Power BI','TMDL/PBIR','Python'] },
]

export default function Projects() {
  const { t } = useLanguage()
  return (
    <section id="projects" className="section">
      <div className="container">
        <p className="section-label">{t('projectsLabel')}</p>
        <h2 className="section-title">{t('projectsTitle')}</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={p.num} className={`project-card reveal reveal-delay-${(i % 2) + 1}`}>
              <div className="project-card-header">
                <span className="project-card-num">{p.num}</span>
                {p.status === 'progress'
                  ? <span className="badge badge-orange">{t('projectProgress')}</span>
                  : <span className="badge badge-lime">{t('projectLive')}</span>
                }
              </div>
              <h3 className="project-card-title">{p.title}</h3>
              <p className="project-card-desc">{t(p.descKey)}</p>
              <div className="project-card-tech">
                {p.tech.map(t2 => <span key={t2} className="tech-pill">{t2}</span>)}
              </div>
              <div className="project-card-links">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="project-link">
                  <GithubIcon /> {t('projectGithub')}
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="project-link">
                    &#8599; {t('projectLive')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
