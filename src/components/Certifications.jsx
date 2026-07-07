import { useLanguage } from '../context/LanguageContext'

const certs = [
  { title: 'AWS AI Practitioner',                 issuer: 'Udacity · AWS',            date: 'Nov 2025', url: 'https://drive.google.com/file/d/14M_gvy2Eg_qEXWq8JfxeVMp5GNLGrlF4/view' },
  { title: 'Data Analysis with Python',           issuer: 'IBM · Cognitive Class',    date: 'Nov 2025', url: 'https://drive.google.com/file/d/1PPZ1-zltXWr5yNmbObTbMmnUs510vaWP/view' },
  { title: 'Advanced SQL',                        issuer: 'Kaggle',                   date: 'Nov 2025', url: 'https://drive.google.com/file/d/1MrmKnVIVe93DGIX9cLZ9U0YRE8OctNbc/view' },
  { title: 'Getting Started with Deep Learning',  issuer: 'NVIDIA',                   date: 'May 2026', url: 'https://drive.google.com/file/d/1FAm5p00UZQYjweFK24o1hGD7YyyjhI5s/view' },
  { title: 'IELTS Academic — Band 5.5',           issuer: 'British Council · IDP',    date: 'Apr 2026', url: 'https://drive.google.com/file/d/1aUcVgsOr1BA5okuxbnx3YvmUnF5HyFiy/view' },
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
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`cert-card reveal reveal-delay-${(i % 4) + 1}`}
            >
              <h4 className="cert-card-title">{c.title}</h4>
              <span className="cert-card-issuer">{c.issuer}</span>
              {c.date && <span className="cert-card-status">{c.date}</span>}
              <span className="cert-card-view">View certificate →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
