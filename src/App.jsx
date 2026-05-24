import { useEffect, useRef, useState } from 'react'
import './App.css'
import silhouette from './assets/Mico_dark.png'
import kevinsExpress from './assets/KevinsExpress.png'
import maxFireman from './assets/MaxFireman.png'
import aboutMe from './assets/AboutMe.jpg'
import GanymedeChat from './components/GanymedeChat'

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

  const programmingWorks = [
    { img: kevinsExpress, title: "Kevin's Express Studio", desc: 'Full-stack booking platform for music studio scheduling and management' },
    { img: maxFireman, title: 'Max Fireman', desc: 'AI-powered support platform that diagnoses bugs and automates ticket creation in ClickUp' },
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

  const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
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

      <section id="about">
        <div className="about-inner">
          <div className="about-left">
            <p className="about-label">About Me</p>
            <h2 className="about-heading">
              Hi, I'm<br />
              <em>Mico Nakase</em>
            </h2>
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
                <span>2</span>
                <p>Projects Built</p>
              </div>
              <div className="about-stat">
                <span>6</span>
                <p>Music Produced</p>
              </div>
            </div>
          </div>
          <div className="about-right">
            <img className="about-portrait" src={aboutMe} alt="Mico Nakase" />
          </div>
        </div>
      </section>

      <section id="works">
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

      <section id="timeline">
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

      <section id="skills">
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
      <GanymedeChat />
    </>
  )
}

export default App
