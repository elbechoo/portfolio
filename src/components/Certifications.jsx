import { useLanguage } from '../context/LanguageContext'

const certs = [
  { title: 'Power BI — Data Analytics',              issuer: 'Klainer' },
  { title: 'Microsoft Excel (Beginner to Advanced)', issuer: 'Udemy' },
  { title: 'Python Bootcamp',                        issuer: 'Udemy' },
  { title: 'Intro to Machine Learning',              issuer: 'Kaggle' },
  { title: 'Career Skills in Data Analytics',        issuer: 'LinkedIn Learning' },
  { title: 'Google Cloud Essentials',                issuer: 'Google Skills Boost' },
  { title: 'IBM Big Data Fundamentals',              issuer: 'IBM' },
  { title: 'Fundamentals of Deep Learning',          issuer: 'NVIDIA' },
  { title: 'SQL for Data Analysis',                  issuer: 'Mode Analytics' },
  { title: 'Data Visualization with Python',         issuer: 'Coursera' },
  { title: 'Tableau for Beginners',                  issuer: 'Udemy' },
  { title: 'Azure Data Fundamentals (DP-900)',        issuer: 'Microsoft', inProgress: true },
]

export default function Certifications() {
  const { t } = useLanguage()
  return (
    <section id="certifications" className="section">
      <div className="container">
        <p className="section-label">{t('certsLabel')}</p>
        <h2 className="section-title">{t('certsTitle')}</h2>
        <div className="cert-grid">
          {certs.map((c, i) => (
            <div key={i} className={`cert-card reveal reveal-delay-${(i % 4) + 1}`}>
              <h4 className="cert-card-title">{c.title}</h4>
              <span className="cert-card-issuer">{c.issuer}</span>
              {c.inProgress && <span className="cert-card-status">· {t('certProgress')}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
