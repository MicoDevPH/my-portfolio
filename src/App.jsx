import { useEffect, useRef, useState } from 'react'
import './App.css'
import silhouette from './assets/Mico_dark.png'
import kevinsExpress from './assets/KevinsExpress.png'
import maxFireman from './assets/MaxFireman.png'
import aboutMe from './assets/AboutMe.jpg'
import myPortfolio from './assets/MyPortfolio.png'
import GanymedeChat from './components/GanymedeChat'
import emailjs from '@emailjs/browser'

const TickerRow = ({ tools, reverse }) => (
  <div className="ticker">
    <div className={`ticker-track${reverse ? ' ticker-reverse' : ''}`}>
      {[...tools, ...tools].map((tool, i) => (
        <div key={i} className="ticker-item">
          <img src={tool.icon} alt={tool.name} />
          <span>{tool.name}</span>
        </div>
      ))}
    </div>
  </div>
)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [flyStyle, setFlyStyle] = useState(null)
  const [heroReady, setHeroReady] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [worksVisible, setWorksVisible] = useState(false)
  const [timelineVisible, setTimelineVisible] = useState(false)
  const [skillsVisible, setSkillsVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  const navLogoRef = useRef(null)
  const loadingLogoRef = useRef(null)

  useEffect(() => {
    const minDisplay = new Promise(resolve => setTimeout(resolve, 2600))
    const fontsReady = document.fonts.ready
    Promise.all([minDisplay, fontsReady]).then(() => {
      // Calculate FLIP: loading logo center → navbar logo center
      if (navLogoRef.current && loadingLogoRef.current) {
        const from = loadingLogoRef.current.getBoundingClientRect()
        const to = navLogoRef.current.getBoundingClientRect()
        const dx = (to.left + to.width / 2) - (from.left + from.width / 2)
        const dy = (to.top + to.height / 2) - (from.top + from.height / 2)
        const scale = to.height / from.height
        setFlyStyle({ dx, dy, scale })
      }
      setFadeOut(true)
      // Hero enters after logo lands (~1100ms fly duration)
      setTimeout(() => setHeroReady(true), 1120)
      setTimeout(() => setIsLoading(false), 1250)
    })
  }, [])

  const [menuOpen, setMenuOpen] = useState(false)
  const [worksTab, setWorksTab] = useState('programming')
  const [timelineTab, setTimelineTab] = useState('education')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const timelineTrackRef = useRef(null)
  const timelineProgressRef = useRef(null)

  const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

  const techIcons = {
    Html5: <img src={`${DEVICON}/html5/html5-original.svg`} width="12" height="12" alt="" />,
    CSS3: <img src={`${DEVICON}/css3/css3-original.svg`} width="12" height="12" alt="" />,
    PHP: <img src={`${DEVICON}/php/php-original.svg`} width="12" height="12" alt="" />,
    React: <img src={`${DEVICON}/react/react-original.svg`} width="12" height="12" alt="" />,
    NodeJS: <img src={`${DEVICON}/nodejs/nodejs-original.svg`} width="12" height="12" alt="" />,
    Python: <img src={`${DEVICON}/python/python-original.svg`} width="12" height="12" alt="" />,
  }

  const programmingWorks = [
    {
      title: "Kevin's Express Studio",
      desc: 'Full-stack booking platform for music studio scheduling and management.',
      img: kevinsExpress,
      tags: ['PHP', 'CSS3', 'Html5'],
    },
    {
      title: 'Max Fireman',
      desc: 'AI-powered support platform that diagnoses bugs and automates ticket creation in ClickUp.',
      img: maxFireman,
      tags: ['React', 'NodeJS', 'Python'],
    },
    {
      title: 'My Portfolio',
      desc: 'Personal portfolio built with Ganymede v1.2, an AI agent developed by Mokusei AI.',
      img: myPortfolio,
      tags: ['React', 'Python'],
    },
  ]

  const prevSlide = () => setCarouselIndex(i => (i - 1 + programmingWorks.length) % programmingWorks.length)
  const nextSlide = () => setCarouselIndex(i => (i + 1) % programmingWorks.length)

  const onTimelineScroll = () => {
    const el = timelineTrackRef.current
    const bar = timelineProgressRef.current
    if (!el || !bar) return
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight)
    bar.style.width = `${Math.min(progress, 1) * 100}%`
  }

  const frontendTools = [
    { name: 'HTML5', icon: `${DEVICON}/html5/html5-original.svg` },
    { name: 'CSS3', icon: `${DEVICON}/css3/css3-original.svg` },
    { name: 'Tailwind', icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
    { name: 'Bootstrap', icon: `${DEVICON}/bootstrap/bootstrap-original.svg` },
    { name: 'React', icon: `${DEVICON}/react/react-original.svg` },
    { name: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg` },
    { name: 'TypeScript', icon: `${DEVICON}/typescript/typescript-original.svg` },
  ]
  const backendTools = [
    { name: 'Java', icon: `${DEVICON}/java/java-original.svg` },
    { name: 'C#', icon: `${DEVICON}/csharp/csharp-original.svg` },
    { name: 'PHP', icon: `${DEVICON}/php/php-original.svg` },
    { name: 'Python', icon: `${DEVICON}/python/python-original.svg` },
    { name: 'Laravel', icon: `${DEVICON}/laravel/laravel-original.svg` },
    { name: 'Node.js', icon: `${DEVICON}/nodejs/nodejs-original.svg` },
    { name: 'FastAPI', icon: `${DEVICON}/fastapi/fastapi-original.svg` },
    { name: 'REST API', icon: `${DEVICON}/openapi/openapi-original.svg` },
    { name: 'MySQL', icon: `${DEVICON}/mysql/mysql-original.svg` },
    { name: 'PostgreSQL', icon: `${DEVICON}/postgresql/postgresql-original.svg` },
    { name: 'MongoDB', icon: `${DEVICON}/mongodb/mongodb-original.svg` },
  ]
  const toolsAndVc = [
    { name: 'GitHub', icon: `${DEVICON}/github/github-original.svg` },
    { name: 'Git', icon: `${DEVICON}/git/git-original.svg` },
    { name: 'Postman', icon: `${DEVICON}/postman/postman-original.svg` },
    { name: 'SonarQube', icon: `${DEVICON}/sonarqube/sonarqube-original.svg` },
    { name: 'Composer', icon: `${DEVICON}/composer/composer-original.svg` },
    { name: 'npm', icon: `${DEVICON}/npm/npm-original-wordmark.svg` },
    { name: 'VS Code', icon: `${DEVICON}/vscode/vscode-original.svg` },
    { name: 'Eclipse', icon: `${DEVICON}/eclipse/eclipse-original.svg` },
  ]

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const formRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  const handleChange = (e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus('sending')
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString(),
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    ).then(() => {
      setFormStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setFormStatus('idle'), 5000)
    }).catch(() => {
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 5000)
    })
  }

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
    const sectionToNav = { hero: 'home', about: 'about', works: 'works', timeline: 'timeline', skills: 'skills', contact: 'contact' }

    const onScroll = () => {
      let current = 'home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 150) {
          current = sectionToNav[id]
        }
      }
      document.querySelectorAll('#navbar a[data-section]').forEach((a) => {
        a.classList.toggle('active', a.dataset.section === current)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // About section scroll reveal
  useEffect(() => {
    const el = document.getElementById('about')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setAboutVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Works section scroll reveal
  useEffect(() => {
    const el = document.getElementById('works')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setWorksVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Timeline section scroll reveal
  useEffect(() => {
    const el = document.getElementById('timeline')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTimelineVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Skills section scroll reveal
  useEffect(() => {
    const el = document.getElementById('skills')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setSkillsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Contact section scroll reveal
  useEffect(() => {
    const el = document.getElementById('contact')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {isLoading && (
        <div className={`loading-screen${fadeOut ? ' fade-out' : ''}`}>
          <span
            ref={loadingLogoRef}
            className={`loading-logo${flyStyle ? ' flying' : ''}`}
            style={flyStyle ? {
              '--fly-x': `${flyStyle.dx}px`,
              '--fly-y': `${flyStyle.dy}px`,
              '--fly-scale': flyStyle.scale,
            } : undefined}
          >MLN.</span>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div id="home" style={{ position: 'absolute', top: 0 }} />
      <nav id="navbar">
        <a
          href="/"
          className="nav-logo"
          ref={navLogoRef}
          style={{ opacity: isLoading ? 0 : 1 }}
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >MLN.</a>
        <ul className="nav-links-desktop">
          {[['home', 'Home'], ['about', 'About'], ['works', 'Works'], ['timeline', 'Timeline'], ['skills', 'Skills'], ['contact', 'Contact']].map(([id, label]) => (
            <li key={id}><a href="/" data-section={id} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={() => setIsDark(d => !d)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <ul>
            {[['home', 'Home'], ['about', 'About'], ['works', 'Works'], ['timeline', 'Timeline'], ['skills', 'Skills'], ['contact', 'Contact']].map(([id, label]) => (
              <li key={id}>
                <a href="/" data-section={id} onClick={e => {
                  e.preventDefault()
                  setMenuOpen(false)
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section id="hero">
        <div className="hero-sticky">
          <div className="hero-name">
            <div ref={micoWrapRef} className="hero-name-row">
              <div className={`hero-enter${heroReady ? ' hero-enter-left' : ''}`}>
                <span ref={micoRef}>MICO</span>
              </div>
            </div>
            <div ref={nakaseWrapRef} className="hero-name-row">
              <div className={`hero-enter${heroReady ? ' hero-enter-right' : ''}`}>
                <span ref={nakaseRef}>NAKASE</span>
              </div>
            </div>
          </div>
          <div ref={silhouetteRef} className="hero-silhouette">
            <div className={`hero-enter${heroReady ? ' hero-enter-pop' : ''}`}>
              <img src={silhouette} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={aboutVisible ? 'about-visible' : ''}>
        <div className="about-inner">
          <div className="about-left">
            <p className="about-label">About Me</p>
            <h2 className="about-heading">
              Hi, I'm<br />
              <em>Mico Nakase</em>
            </h2>
            <div className="about-btns">
              <a className="about-cv-btn" href="/resume.pdf" target="_blank" download>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>
              <a className="about-cv-btn about-cv-btn-outline" href="#works">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="12" y2="13" />
                </svg>
                View My Work
              </a>
            </div>
            <div className="about-content">
              <p>
                I'm a Full Stack & Generative AI Developer and music producer who enjoys building
                things that look good and work well. I like writing clean code just as
                much as I like producing beats — always learning, always creating.
              </p>
              <p>
                Currently a Full Stack & Generative AI Developer Intern at <strong>Prosperna
                Philippines</strong> and the Producer &amp; External Vice President
                at <strong>Truchorus Performance Company</strong>.
              </p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <span>3</span>
                <p>Projects Built</p>
              </div>
              <div className="about-stat">
                <span>6</span>
                <p>Music Produced</p>
              </div>
            </div>
          </div>
          <div className="about-right">
            <div className="about-image-wrap">
              <img className="about-portrait" src={aboutMe} alt="Mico Nakase" />
            </div>
          </div>
        </div>
      </section>

      <section id="works" className={worksVisible ? 'works-visible' : ''}>
        <div className="works-inner">
          <h2 className="works-heading">
            My <em>Works</em>
          </h2>
          <p className="works-description">
            From building apps to producing beats — here's what I've been working on.
          </p>
          <div className="works-tabs">
            <button
              className={`works-tab${worksTab === 'programming' ? ' active' : ''}`}
              onClick={() => { setWorksTab('programming'); setCarouselIndex(0) }}
            >
              Programming
            </button>
            <button
              className={`works-tab${worksTab === 'music' ? ' active' : ''}`}
              onClick={() => setWorksTab('music')}
            >
              Music
            </button>
          </div>

          {worksTab === 'programming' && (
            <div className="carousel">
              <button className="carousel-btn carousel-prev" onClick={prevSlide} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="carousel-track">
                {programmingWorks.map((work, i) => {
                  const offset = (i - carouselIndex + programmingWorks.length) % programmingWorks.length
                  let position = 'center'
                  if (programmingWorks.length > 1) {
                    if (offset === 0) position = 'center'
                    else if (offset <= Math.floor(programmingWorks.length / 2)) position = 'right'
                    else position = 'left'
                  }
                  return (
                    <div key={i} className={`carousel-slide carousel-${position}`}>
                      <img src={work.img} alt={work.title} />
                      <div className="carousel-info">
                        <span className="carousel-title">{work.title}</span>
                        <span className="carousel-desc">{work.desc}</span>
                        {work.tags && (
                          <div className="carousel-tags">
                            {work.tags.map((tag, i) => (
                              <span key={i} className="carousel-tag">
                                {techIcons[tag]}
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="carousel-btn carousel-next" onClick={nextSlide} aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="timeline" className={timelineVisible ? 'timeline-visible' : ''}>
        <div className="timeline-inner">
          <h2 className="timeline-heading">
            My <em>Journey</em>
          </h2>
          <p className="timeline-description">
            Education, experience, and leadership.
          </p>
          <div className="timeline-tabs">
            <button
              className={`timeline-tab${timelineTab === 'education' ? ' active' : ''}`}
              onClick={() => { setTimelineTab('education'); if (timelineProgressRef.current) timelineProgressRef.current.style.width = '0%' }}
            >
              Education
            </button>
            <button
              className={`timeline-tab${timelineTab === 'experience' ? ' active' : ''}`}
              onClick={() => { setTimelineTab('experience'); if (timelineProgressRef.current) timelineProgressRef.current.style.width = '0%' }}
            >
              Experience
            </button>
            <button
              className={`timeline-tab${timelineTab === 'leadership' ? ' active' : ''}`}
              onClick={() => { setTimelineTab('leadership'); if (timelineProgressRef.current) timelineProgressRef.current.style.width = '0%' }}
            >
              Leadership
            </button>
          </div>
          <div className="timeline-scroll">
          <div className="timeline-progress" ref={timelineProgressRef} />
          <div className="timeline-track" ref={timelineTrackRef} onScroll={onTimelineScroll}>

            {timelineTab === 'education' && (
              <>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2022 – Present</span>
                    <h3>BS in Information Technology</h3>
                    <p>Saint Francis Institute of Computer Studies</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2020 – 2022</span>
                    <h3>STEM (Senior High School)</h3>
                    <p>San Francisco De Sales School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2016 – 2020</span>
                    <h3>Junior High School</h3>
                    <p>Adelina I National High School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2014 – 2016</span>
                    <h3>Elementary</h3>
                    <p>San Pedro Central Elementary School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2010 – 2014</span>
                    <h3>Elementary</h3>
                    <p>Adonai Christian Academy of Muntinlupa</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2009 – 2010</span>
                    <h3>Kindergarten</h3>
                    <p>Laguna Northwestern College</p>
                  </div>
                </div>
              </>
            )}

            {timelineTab === 'experience' && (
              <div className="timeline-entry" data-side="left">
                <div className="timeline-content">
                  <span className="timeline-date">Feb 2026 – Present</span>
                  <h3>Full Stack & Generative AI Developer Intern</h3>
                  <p>Prosperna Philippines</p>
                </div>
              </div>
            )}

            {timelineTab === 'leadership' && (
              <>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2024 – 2026</span>
                    <h3>SBO President</h3>
                    <p>Saint Francis Institute of Computer Studies</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2024 – Present</span>
                    <h3>External Vice President</h3>
                    <p>Truchorus Performance Company</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2023 – 2024</span>
                    <h3>SBO Vice President</h3>
                    <p>Saint Francis Institute of Computer Studies</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2022 – 2023</span>
                    <h3>President</h3>
                    <p>Cascop Compound Youth Organization</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2021</span>
                    <h3>SSC Business Manager</h3>
                    <p>San Francisco De Sales School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2019</span>
                    <h3>SSG Federation Peace Officer</h3>
                    <p>San Pedro City, Laguna</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2019</span>
                    <h3>Junior Barangay Official – 2nd Councilor</h3>
                    <p>Barangay San Antonio, San Pedro City, Laguna</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2019</span>
                    <h3>SSG President</h3>
                    <p>Adelina I National High School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2018</span>
                    <h3>SSG P.I.O.</h3>
                    <p>Adelina I National High School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="right">
                  <div className="timeline-content">
                    <span className="timeline-date">2017</span>
                    <h3>SSG Auxiliary</h3>
                    <p>Adelina I National High School</p>
                  </div>
                </div>
                <div className="timeline-entry" data-side="left">
                  <div className="timeline-content">
                    <span className="timeline-date">2017</span>
                    <h3>Interact Club P.O. Boy</h3>
                    <p>Adelina I National High School</p>
                  </div>
                </div>
              </>
            )}

          </div>
          <div className="timeline-fade" />
          </div>
        </div>
      </section>

      <section id="skills" className={skillsVisible ? 'skills-visible' : ''}>
        <div className="skills-inner">
          <h2 className="skills-heading">
            Tech <em>Stack</em>
          </h2>
          <p className="skills-description">
            Tools and technologies I work with.
          </p>
          <div className="skills-category">
            <p className="skills-label">Frontend</p>
            <TickerRow tools={frontendTools} />
          </div>
          <div className="skills-category">
            <p className="skills-label">Backend</p>
            <TickerRow tools={backendTools} reverse />
          </div>
          <div className="skills-category">
            <p className="skills-label">Tools & Version Control</p>
            <TickerRow tools={toolsAndVc} />
          </div>
        </div>
      </section>

      <section id="contact" className={contactVisible ? 'contact-visible' : ''}>
        <div className="contact-inner">
          <h2 className="contact-heading">Get In <em>Touch</em></h2>
          <p className="contact-description">Have a project in mind or just want to say hi? Drop me a message!</p>
          <div className="contact-grid">
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input className="form-input" type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input className="form-input" type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input className="form-input" type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <textarea className="form-textarea" name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required />
              </div>
              <button className="form-btn" type="submit" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {formStatus === 'success' && <p className="form-success">Message sent successfully!</p>}
              {formStatus === 'error' && <p className="form-error">Failed to send. Please try again.</p>}
            </form>
            <div className="contact-info">
              <p className="contact-info-label">Connect With Me</p>
              <div className="contact-social">
                <a href="https://github.com/MicoDevPH" target="_blank" rel="noopener noreferrer" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="https://www.facebook.com/mics12345" target="_blank" rel="noopener noreferrer" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <a href="https://www.instagram.com/itsmicssss_/" target="_blank" rel="noopener noreferrer" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  Instagram
                </a>
                <a href="https://www.tiktok.com/@micodevph" target="_blank" rel="noopener noreferrer" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  TikTok
                </a>
                <a href="https://www.linkedin.com/in/mico-nakase-0835b1391/" target="_blank" rel="noopener noreferrer" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a href="mailto:miconakaseyt@gmail.com" className="contact-social-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <GanymedeChat />
      <footer>
        <div className="footer-inner">
          <span className="footer-brand">MLN.</span>
          <div className="footer-meta">
            <span className="footer-location">San Pedro, Laguna</span>
            <span className="footer-sep">&middot;</span>
            <span className="footer-availability">
              <span className="avail-dot" />
              Open to work
            </span>
          </div>
          <div className="footer-social">
            <a href="https://github.com/MicoDevPH" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.facebook.com/mics12345" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/itsmicssss_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@micodevph" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/mico-nakase-0835b1391/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:miconakaseyt@gmail.com" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
          <p className="footer-copy">&copy; 2026 Mico Nakase. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
