export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-copy">
          © {year} <span>Hachem Zenati</span>
        </p>
        <div className="footer-links">
          <a href="https://github.com/elbechoo" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://www.linkedin.com/in/hechem-znetti-a0a4b12b7" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="/Hachem_Zenati_CV.pdf" download="Hachem_Zenati_CV.pdf" target="_blank" rel="noopener noreferrer" className="footer-link">Resume</a>
        </div>
      </div>
    </footer>
  )
}
