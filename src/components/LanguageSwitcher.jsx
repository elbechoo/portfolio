import { useLanguage } from '../context/LanguageContext'

const langs = [
  { code: 'en', flag: 'GB', label: 'EN' },
  { code: 'fr', flag: 'FR', label: 'FR' },
  { code: 'ar', flag: 'AR', label: 'AR' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="lang-switcher">
      {langs.map((l) => (
        <button
          key={l.code}
          className={`lang-switcher-btn${lang === l.code ? ' active' : ''}`}
          onClick={() => setLang(l.code)}
        >
          <span className="lang-switcher-flag">{l.flag}</span>
          <span className="lang-switcher-label">{l.label}</span>
        </button>
      ))}
    </div>
  )
}
