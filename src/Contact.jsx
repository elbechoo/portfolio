import { useEffect, useRef, useState } from 'react'
import { LINKS, CONTACT_ENDPOINT } from './content'

const EMPTY = { name: '', company: '', role: '', email: '', phone: '', country: '', topic: '', message: '', consent: false, website: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Where the visitor came from: ?src=fair on a printed QR, utm_source on a campaign link.
function sourceOf() {
  const q = new URLSearchParams(window.location.search)
  return q.get('src') || q.get('utm_source') || ''
}

function validate(v, f) {
  const e = {}
  if (!v.name.trim()) e.name = f.required
  if (!v.company.trim()) e.company = f.required
  if (!EMAIL_RE.test(v.email.trim())) e.email = f.invalidEmail
  if (v.message.trim().length < 10) e.message = f.tooShort
  if (!v.consent) e.consent = f.consentRequired
  return e
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {hint && <span className="hint"> {hint}</span>}
      </label>
      {children}
      {error && <p className="err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  )
}

export default function Contact({ c, lang }) {
  const k = c.contact
  const f = k.form
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')          // idle | sending | sent | failed
  const [ref, setRef] = useState('')
  const opened = useRef(0)
  // When the form appeared; the backend rejects anything filled in under three seconds.
  useEffect(() => { opened.current = Date.now() }, [])

  const set = (name) => (ev) => {
    const val = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
    setV((prev) => ({ ...prev, [name]: val }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const aria = (name) => ({
    id: `cf-${name}`,
    name,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `cf-${name}-err` : undefined,
  })

  async function submit(ev) {
    ev.preventDefault()
    const found = validate(v, f)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus()
      return
    }

    // Until the sheet is connected, the form still works: it opens a prefilled email.
    if (!CONTACT_ENDPOINT) {
      const body = `${v.message}\n\n${v.name}\n${v.role ? v.role + ', ' : ''}${v.company}\n${v.phone}`
      window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(`${v.topic || 'Contact'}: ${v.company}`)}&body=${encodeURIComponent(body)}`
      return
    }

    setState('sending')
    try {
      // text/plain keeps this a "simple" request, so the browser sends it without a CORS preflight.
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          ...v,
          lang,
          source: sourceOf(),
          referrer: document.referrer,
          elapsedMs: Date.now() - opened.current,
        }),
      })
      const out = await res.json()
      if (!out.ok) throw new Error(out.error || 'failed')
      setRef(out.ref || '')
      setState('sent')
    } catch {
      setState('failed')
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-label">
      <div className="wrap">
        <div className="row head">
          <p className="label" id="contact-label">{k.label}</p>
          <div>
            <h2>{k.title}</h2>
            <p className="contact-sub">{k.sub}</p>
          </div>
        </div>

        <div className="row">
          <span />
          <div className="contact-grid">
            <aside className="direct" aria-label={k.direct}>
              <dl>
                <div><dt>{k.email}</dt><dd><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></dd></div>
                <div><dt>{k.phone}</dt><dd><a href={LINKS.phoneHref} dir="ltr">{LINKS.phone}</a></dd></div>
                <div><dt>LinkedIn</dt><dd><a href={LINKS.linkedin} target="_blank" rel="noopener">in/hachem-zenati</a></dd></div>
                <div><dt>{k.location}</dt><dd>{k.locationVal}</dd></div>
                <div><dt>{k.availability}</dt><dd>{k.availabilityVal}</dd></div>
              </dl>
              <p className="cv-line">
                <a href={LINKS.cvEn} target="_blank" rel="noopener">{c.hero.cvEn}</a>
                <a href={LINKS.cvFr} target="_blank" rel="noopener">{c.hero.cvFr}</a>
              </p>
            </aside>

            {state === 'sent' ? (
              <div className="sent" role="status">
                <h3>{f.sentTitle}</h3>
                <p>{f.sentBody.replace('{email}', v.email.trim())}</p>
                {ref && <p className="ref">{f.refLabel} <span dir="ltr">{ref}</span></p>}
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate>
                <div className="pair">
                  <Field id="cf-name" label={f.name} error={errors.name}>
                    <input {...aria('name')} autoComplete="name" value={v.name} onChange={set('name')} maxLength={120} />
                  </Field>
                  <Field id="cf-company" label={f.company} error={errors.company}>
                    <input {...aria('company')} autoComplete="organization" value={v.company} onChange={set('company')} maxLength={120} />
                  </Field>
                </div>
                <div className="pair">
                  <Field id="cf-role" label={f.role} hint={f.optional}>
                    <input {...aria('role')} autoComplete="organization-title" value={v.role} onChange={set('role')} maxLength={120} />
                  </Field>
                  <Field id="cf-email" label={f.email} error={errors.email}>
                    <input {...aria('email')} type="email" autoComplete="email" inputMode="email" dir="ltr" value={v.email} onChange={set('email')} maxLength={200} />
                  </Field>
                </div>
                <div className="pair">
                  <Field id="cf-phone" label={f.phone} hint={f.optional}>
                    <input {...aria('phone')} type="tel" autoComplete="tel" inputMode="tel" dir="ltr" value={v.phone} onChange={set('phone')} maxLength={40} />
                  </Field>
                  <Field id="cf-country" label={f.country} hint={f.optional}>
                    <input {...aria('country')} autoComplete="country-name" value={v.country} onChange={set('country')} maxLength={80} />
                  </Field>
                </div>
                <Field id="cf-topic" label={f.topic}>
                  <select {...aria('topic')} value={v.topic} onChange={set('topic')}>
                    <option value="">{f.topicPick}</option>
                    {f.topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field id="cf-message" label={f.message} error={errors.message}>
                  <textarea {...aria('message')} rows={6} placeholder={f.messagePh} value={v.message} onChange={set('message')} maxLength={4000} />
                </Field>

                {/* Hidden from people, visible to form-filling scripts. */}
                <div className="hp" aria-hidden="true">
                  <label htmlFor="cf-website">Website</label>
                  <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
                </div>

                <div className={`consent${errors.consent ? ' has-error' : ''}`}>
                  <input {...aria('consent')} type="checkbox" checked={v.consent} onChange={set('consent')} />
                  <label htmlFor="cf-consent">{f.consent}</label>
                  {errors.consent && <p className="err" id="cf-consent-err" role="alert">{errors.consent}</p>}
                </div>

                <div className="submit-row">
                  <button className="btn" type="submit" disabled={state === 'sending'}>
                    {state === 'sending' ? f.sending : f.submit}
                  </button>
                  <p className="fine">{f.reply}</p>
                </div>
                {state === 'failed' && (
                  <p className="err" role="alert">{f.failed} <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
