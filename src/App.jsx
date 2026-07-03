import { useEffect, useState } from 'react'
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

const SECTION_IDS = ['hero', 'about', 'works', 'timeline', 'skills', 'contact']

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [columnsReveal, setColumnsReveal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [worksTab, setWorksTab] = useState('programming')
  const [timelineTab, setTimelineTab] = useState('education')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [selectedWork, setSelectedWork] = useState(null)
  const { theme, toggle: toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)

  useEffect(() => {
    if (selectedWork) window.scrollTo(0, 0)
  }, [selectedWork])

  useEffect(() => {
    const minDisplay = new Promise((resolve) => setTimeout(resolve, 1900))
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
          onTabChange={(tab) => {
            setWorksTab(tab)
            setCarouselIndex(0)
          }}
          carouselIndex={carouselIndex}
          onPrev={setCarouselIndex}
          onNext={setCarouselIndex}
          onSelectWork={setSelectedWork}
        />
        <Timeline timelineTab={timelineTab} onTabChange={setTimelineTab} />
        <Skills />
        <Contact />
        <ErrorBoundary>
          {/* <GanymedeChat /> */}
        </ErrorBoundary>
        <Footer />
      </div>

      <div style={{ display: selectedWork ? '' : 'none' }}>
        <ErrorBoundary>
          <WorkDetail work={selectedWork} onBack={() => setSelectedWork(null)} />
        </ErrorBoundary>
      </div>
      <Cursor />
    </>
  )
}

export default App
