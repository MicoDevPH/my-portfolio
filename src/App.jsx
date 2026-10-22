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
import { useTheme } from './hooks/useTheme'
import { useActiveSection } from './hooks/useActiveSection'
import { useContent } from './hooks/useContent'

const SECTION_IDS = ['hero', 'about', 'works', 'timeline', 'skills', 'contact']
// Never hold the loading screen longer than this waiting on content
const CONTENT_TIMEOUT = 8000

// Project detail pages live at #/works/<slug> so back, refresh and sharing all work
const slugFromHash = () => window.location.hash.match(/^#\/works\/(.+)$/)?.[1] ?? null

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [columnsReveal, setColumnsReveal] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [contentWaitOver, setContentWaitOver] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [worksTab, setWorksTab] = useState('programming')
  const [selectedSlug, setSelectedSlug] = useState(slugFromHash)
  const openedFromList = useRef(false)
  const wasOpen = useRef(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)
  const content = useContent()
  const selectedWork = content.projects.find((w) => w.slug === selectedSlug) ?? null

  // Follow the URL (covers the browser back/forward buttons too)
  useEffect(() => {
    const onHashChange = () => setSelectedSlug(slugFromHash())
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
    window.location.hash = `/works/${work.slug}`
  }

  const closeWork = () => {
    if (openedFromList.current) {
      // Step back so the detail page doesn't linger in history
      openedFromList.current = false
      window.history.back()
    } else {
      // Landed directly on a shared link: drop the hash and show the page
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setSelectedSlug(null)
    }
  }

  useEffect(() => {
    const minDisplay = new Promise((resolve) => setTimeout(resolve, 2400))
    const fontsReady = document.fonts.ready
    Promise.all([minDisplay, fontsReady]).then(() => setIntroDone(true))
  }, [])

  // Leave the loading screen once the intro has played and content has arrived (or timed out)
  useEffect(() => {
    const timer = setTimeout(() => setContentWaitOver(true), CONTENT_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])
  const contentSettled = content.status !== 'loading' || contentWaitOver
  const fadeOut = introDone && contentSettled

  useEffect(() => {
    if (!fadeOut) return
    const reveal = setTimeout(() => setColumnsReveal(true), 800)
    const done = setTimeout(() => setIsLoading(false), 2200)
    return () => {
      clearTimeout(reveal)
      clearTimeout(done)
    }
  }, [fadeOut])

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
        <About projectCount={content.projects.length} trackCount={content.music.length} />
        <Works
          projects={content.projects}
          music={content.music}
          loadFailed={content.status === 'error'}
          worksTab={worksTab}
          onTabChange={setWorksTab}
          onSelectWork={openWork}
        />
        <Timeline journey={content.journey} />
        <Skills party={content.skills.party} box={content.skills.box} boxCount={content.skills.boxCount} />
        <Contact />
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
