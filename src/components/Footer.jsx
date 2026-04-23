import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-copy">
          © {year} <span>Hachem Zenati</span> — {t('footerCopy')}
        </p>
        <div className="footer-links">
          <a href="https://github.com/elbechoo" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://www.linkedin.com/in/hechem-znetti-a0a4b12b7" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="/cv.html" target="_blank" rel="noopener noreferrer" className="footer-link">Resume</a>
        </div>
      </div>
    </footer>
  )
}
