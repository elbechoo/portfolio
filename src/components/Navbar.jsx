import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  const links = [
    { id: 'projects', label: t('navProjects') },
    { id: 'skills',   label: t('navSkills')   },
    { id: 'awards',   label: t('navAwards')   },
    { id: 'contact',  label: t('navContact')  },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <button
          className="nav-logo"
          onClick={() => scrollTo('home')}
          style={{ background: 'none', border: 'none' }}
        >
          HZ<span>.</span>
        </button>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}>
              <button
                className={`nav-link${activeSection === l.id ? ' active' : ''}`}
                onClick={() => scrollTo(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <LanguageSwitcher />
          <button
            className="nav-cta"
            onClick={() => scrollTo('contact')}
          >
            {t('navHireMe')}
          </button>
        </div>
      </div>
    </nav>
  )
}
