import { useEffect, useRef } from 'react'
import './App.css'
import silhouette from './assets/Mico_dark.png'

function App() {
  const micoRef = useRef(null)
  const nakaseRef = useRef(null)
  const micoWrapRef = useRef(null)
  const nakaseWrapRef = useRef(null)
  const silhouetteRef = useRef(null)

  // Equalize MICO / NAKASE widths to match navbar
  useEffect(() => {
    const equalize = () => {
      if (!micoRef.current || !nakaseRef.current) return

      const navbar = document.getElementById('navbar')
      const targetW = navbar ? navbar.getBoundingClientRect().width : window.innerWidth
      const vw = window.innerWidth

      const getTextWidth = (el) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return range.getBoundingClientRect().width
      }

      nakaseRef.current.style.fontSize = ''
      micoRef.current.style.fontSize = ''
      micoRef.current.style.transform = ''
      void nakaseRef.current.offsetWidth
      void micoRef.current.offsetWidth

      const baseFs = parseFloat(window.getComputedStyle(nakaseRef.current).fontSize)
      const nakaseTextW = getTextWidth(nakaseRef.current)
      const newFsVw = ((baseFs * (targetW / nakaseTextW)) / vw * 100).toFixed(4)

      nakaseRef.current.style.fontSize = newFsVw + 'vw'
      micoRef.current.style.fontSize = newFsVw + 'vw'
      void micoRef.current.offsetWidth

      const micoTextW = getTextWidth(micoRef.current)
      const scale = (targetW / micoTextW).toFixed(6)
      micoRef.current.style.transformOrigin = '50% 0'
      micoRef.current.style.transform = `scaleX(${scale})`
    }

    document.fonts.ready.then(equalize)
    window.addEventListener('resize', equalize)
    return () => window.removeEventListener('resize', equalize)
  }, [])

  // Scroll-exit animation: MICO → right, NAKASE → left, silhouette shrinks
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)

      if (micoWrapRef.current) {
        micoWrapRef.current.style.transform = `translateX(${progress * 105}%)`
      }
      if (nakaseWrapRef.current) {
        nakaseWrapRef.current.style.transform = `translateX(${-progress * 105}%)`
      }
      if (silhouetteRef.current) {
        const s = Math.max(0, 1 - progress * 1.6)
        silhouetteRef.current.style.transform = `translateX(-50%) scale(${s})`
        silhouetteRef.current.style.opacity = s
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active nav link on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'works', 'timeline', 'skills', 'contact']
    const sectionToHref = { hero: '#home', about: '#about', works: '#works', timeline: '#timeline', skills: '#skills', contact: '#contact' }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = sectionToHref[entry.target.id]
            document.querySelectorAll('#navbar ul a').forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === href)
            })
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div id="home" style={{ position: 'absolute', top: 0 }} />
      <nav id="navbar">
        <a href="#home" className="nav-logo">MLN.</a>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="hero">
        <div className="hero-sticky">
          <div className="hero-name">
            <div ref={micoWrapRef} className="hero-name-row">
              <span ref={micoRef}>MICO</span>
            </div>
            <div ref={nakaseWrapRef} className="hero-name-row">
              <span ref={nakaseRef}>NAKASE</span>
            </div>
          </div>
          <div ref={silhouetteRef} className="hero-silhouette">
            <img src={silhouette} alt="" />
          </div>
        </div>
      </section>

      <section id="about">
        <div className="about-inner">
          <p className="about-label">About Me</p>
          <h2 className="about-heading">
            I Build<br />
            <em>Digital</em><br />
            Experiences.
          </h2>
          <div className="about-content">
            <p>
              I'm Mico L. Nakase — a developer and creative technologist passionate about crafting
              fast, beautiful, and purposeful digital products. With a sharp eye for design and a
              deep love for clean code, I bridge the gap between ideas and execution.
            </p>
            <p>
              Currently building products at <strong>Prosperna</strong>, empowering Filipino businesses
              to thrive in the digital landscape.
            </p>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <span>5+</span>
              <p>Years Experience</p>
            </div>
            <div className="about-stat">
              <span>30+</span>
              <p>Projects Built</p>
            </div>
            <div className="about-stat">
              <span>10+</span>
              <p>Happy Clients</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
