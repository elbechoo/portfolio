import './index.css'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Awards from './components/Awards'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const outerCursor = useRef(null)
  const innerCursor = useRef(null)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const outer = outerCursor.current
    const inner = innerCursor.current
    let outerX = 0, outerY = 0
    let targetX = 0, targetY = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      inner.style.left = e.clientX + 'px'
      inner.style.top = e.clientY + 'px'
    }

    const lerp = () => {
      outerX += (targetX - outerX) * 0.12
      outerY += (targetY - outerY) * 0.12
      outer.style.left = outerX + 'px'
      outer.style.top = outerY + 'px'
      requestAnimationFrame(lerp)
    }

    window.addEventListener('mousemove', onMove)
    lerp()

    // Hover effect on interactive elements
    const interactables = document.querySelectorAll('a, button, .card, .skill-card, .project-card, .cert-card, .award-card')
    const addHover = () => outer.classList.add('hovered')
    const removeHover = () => outer.classList.remove('hovered')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    // Active section tracking
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
    }, { threshold: 0.4 })
    sections.forEach(s => observer.observe(s))

    // Reveal animations
    const reveals = document.querySelectorAll('.reveal, .section-label, .section-title')
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    reveals.forEach(el => revealObs.observe(el))

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      revealObs.disconnect()
    }
  }, [])

  return (
    <LanguageProvider>
      <div ref={outerCursor} className="cursor-outer" />
      <div ref={innerCursor} className="cursor-inner" />
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <div className="divider" />
        <About />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Awards />
        <div className="divider" />
        <Certifications />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
