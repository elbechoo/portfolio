import { useLanguage } from '../context/LanguageContext'

const skillGroups = [
  [
    { icon: '📊', name: 'Power BI',     levelKey: 'skillAdvanced' },
    { icon: '📈', name: 'DAX',          levelKey: 'skillAdvanced' },
    { icon: '🔄', name: 'Power Query',  levelKey: 'skillAdvanced' },
    { icon: '📋', name: 'Excel',        levelKey: 'skillAdvanced' },
    { icon: '📉', name: 'Tableau',      levelKey: 'skillIntermediate' },
  ],
  [
    { icon: '🐍', name: 'Python',       levelKey: 'skillAdvanced' },
    { icon: '🤖', name: 'Scikit-learn', levelKey: 'skillIntermediate' },
    { icon: '🧮', name: 'Pandas',       levelKey: 'skillAdvanced' },
    { icon: '📐', name: 'NumPy',        levelKey: 'skillIntermediate' },
    { icon: '🎨', name: 'Matplotlib',   levelKey: 'skillIntermediate' },
    { icon: '⚡', name: 'FastAPI',      levelKey: 'skillIntermediate' },
  ],
  [
    { icon: '🗄️', name: 'SQL Server',   levelKey: 'skillAdvanced' },
    { icon: '🔗', name: 'SQLAlchemy',   levelKey: 'skillIntermediate' },
    { icon: '📦', name: 'T-SQL',        levelKey: 'skillAdvanced' },
  ],
  [
    { icon: '⚛️', name: 'Next.js',      levelKey: 'skillIntermediate' },
    { icon: '🌐', name: 'React',        levelKey: 'skillIntermediate' },
    { icon: '🔐', name: 'BCrypt / Auth',levelKey: 'skillIntermediate' },
    { icon: '🐙', name: 'Git',          levelKey: 'skillIntermediate' },
  ],
]

const catKeys = ['skillsCat1', 'skillsCat2', 'skillsCat3', 'skillsCat4']

export default function Skills() {
  const { t } = useLanguage()
  return (
    <section id="skills" className="section">
      <div className="container">
        <p className="section-label">{t('skillsLabel')}</p>
        <h2 className="section-title">{t('skillsTitle')}</h2>
        <div className="skills-categories">
          {skillGroups.map((group, gi) => (
            <div key={gi} className={`reveal reveal-delay-${gi + 1}`}>
              <p className="skill-category-label">{t(catKeys[gi])}</p>
              <div className="skills-grid">
                {group.map((sk, si) => (
                  <div key={si} className="skill-card">
                    <span className="skill-card-icon">{sk.icon}</span>
                    <span className="skill-card-name">{sk.name}</span>
                    <span className="skill-card-level">{t(sk.levelKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
