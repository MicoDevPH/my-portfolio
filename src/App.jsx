import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const micoRef = useRef(null)
  const nakaseRef = useRef(null)

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

      // Reset everything and force reflow before measuring
      nakaseRef.current.style.fontSize = ''
      micoRef.current.style.fontSize = ''
      micoRef.current.style.letterSpacing = '0'
      micoRef.current.style.marginRight = '0'
      micoRef.current.style.transform = ''
      void nakaseRef.current.offsetWidth
      void micoRef.current.offsetWidth

      // Scale font so NAKASE matches navbar width exactly
      const baseFs = parseFloat(window.getComputedStyle(nakaseRef.current).fontSize)
      const nakaseTextW = getTextWidth(nakaseRef.current)
      const newFsVw = ((baseFs * (targetW / nakaseTextW)) / vw * 100).toFixed(4)

      nakaseRef.current.style.fontSize = newFsVw + 'vw'
      micoRef.current.style.fontSize = newFsVw + 'vw'
      void micoRef.current.offsetWidth

      // ScaleX MICO to exactly match navbar width — no trailing-space ambiguity
      const micoTextW = getTextWidth(micoRef.current)
      const scale = (targetW / micoTextW).toFixed(6)
      micoRef.current.style.transformOrigin = '50% 0'
      micoRef.current.style.transform = `scaleX(${scale})`
    }

    document.fonts.ready.then(equalize)
    window.addEventListener('resize', equalize)
    return () => window.removeEventListener('resize', equalize)
  }, [])

  return (
    <>
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
        <div className="hero-name">
          <span ref={micoRef}>MICO</span>
          <span ref={nakaseRef}>NAKASE</span>
        </div>
      </section>
    </>
  )
}

export default App
