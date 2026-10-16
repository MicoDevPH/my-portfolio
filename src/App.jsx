import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WorkDetail from './components/WorkDetail'
import ErrorBoundary from './components/ErrorBoundary'
import Cursor from './components/Cursor'
// import GanymedeChat from './components/GanymedeChat'
import { useTheme } from './hooks/useTheme'
import { useActiveSection } from './hooks/useActiveSection'
import { programmingWorks, slugify } from './constants/worksData'

const SECTION_IDS = ['hero', 'about', 'works', 'timeline', 'skills', 'contact']

// Project detail pages live at #/works/<slug> so back, refresh and sharing all work
const workFromHash = () => {
  const slug = window.location.hash.match(/^#\/works\/(.+)$/)?.[1]
  return slug ? (programmingWorks.find((w) => slugify(w.title) === slug) ?? null) : null
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [columnsReveal, setColumnsReveal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [worksTab, setWorksTab] = useState('programming')
  const [selectedWork, setSelectedWork] = useState(workFromHash)
  const openedFromList = useRef(false)
  const wasOpen = useRef(selectedWork !== null)
  const { theme, toggle: toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)

  // Follow the URL (covers the browser back/forward buttons too)
  useEffect(() => {
    const onHashChange = () => setSelectedWork(workFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Opening a project starts at its top; closing one returns to the Works section
  useEffect(() => {
    if (selectedWork) window.scrollTo(0, 0)
    else if (wasOpen.current) requestAnimationFrame(() => document.getElementById('works')?.scrollIntoView())
    wasOpen.current = selectedWork !== null
  }, [selectedWork])

  const openWork = (work) => {
    openedFromList.current = true
    window.location.hash = `/works/${slugify(work.title)}`
  }

  const closeWork = () => {
    if (openedFromList.current) {
      // Step back so the detail page doesn't linger in history
      openedFromList.current = false
      window.history.back()
    } else {
      // Landed directly on a shared link: drop the hash and show the page
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setSelectedWork(null)
    }
  }

  useEffect(() => {
    const minDisplay = new Promise((resolve) => setTimeout(resolve, 2400))
    const fontsReady = document.fonts.ready
    Promise.all([minDisplay, fontsReady]).then(() => {
      setFadeOut(true)
      setTimeout(() => setColumnsReveal(true), 800)
      setTimeout(() => setIsLoading(false), 2200)
    })
  }, [])

  return (
    <>
      {isLoading && (
        <LoadingScreen fadeOut={fadeOut} columnsReveal={columnsReveal} />
      )}

      {!selectedWork && (
        <Navbar
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((o) => !o)}
          theme={theme}
          onToggleTheme={toggleTheme}
          activeSection={activeSection}
        />
      )}

      <div className="main-page bg-(--color-bg)" style={{ display: selectedWork ? 'none' : '' }}>
        <div id="home" style={{ position: 'absolute', top: 0 }} />
        <Hero />
        <About />
        <Works
          worksTab={worksTab}
          onTabChange={setWorksTab}
          onSelectWork={openWork}
        />
        <Timeline />
        <Skills />
        <Contact />
        <ErrorBoundary>
          {/* <GanymedeChat /> */}
        </ErrorBoundary>
        <Footer />
      </div>

      <div style={{ display: selectedWork ? '' : 'none' }}>
        <ErrorBoundary>
          <WorkDetail work={selectedWork} onBack={closeWork} />
        </ErrorBoundary>
      </div>
      <Cursor />
    </>
  )
}

export default App
