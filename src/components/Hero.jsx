import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Hero() {
  const { theme } = useTheme()
  const micoRef = useRef(null)
  const nakaseRef = useRef(null)
  const innerRef = useRef(null)
  const heroSectionRef = useRef(null)
  const scrollWrapperRef = useRef(null)

  useScrollAnimation(heroSectionRef, scrollWrapperRef)

  useEffect(() => {
    const equalize = () => {
      if (!micoRef.current || !nakaseRef.current || !innerRef.current) return
      const navbar = document.getElementById('navbar')
      if (!navbar) return
      const targetW = navbar.getBoundingClientRect().width
      const vw = window.innerWidth
      const scaleY = parseFloat(getComputedStyle(innerRef.current).getPropertyValue('--hero-scale-y')) || 1.3

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
      const newFsVw = (((baseFs * (targetW / nakaseTextW)) / vw) * 100).toFixed(4)
      nakaseRef.current.style.fontSize = newFsVw + 'vw'
      micoRef.current.style.fontSize = newFsVw + 'vw'
      void micoRef.current.offsetWidth

      nakaseRef.current.style.transformOrigin = '50% 50%'
      nakaseRef.current.style.transform = `scaleY(${scaleY})`

      const micoTextW = getTextWidth(micoRef.current)
      const scale = (targetW / micoTextW).toFixed(6)
      micoRef.current.style.transformOrigin = '50% 50%'
      micoRef.current.style.transform = `scaleX(${scale}) scaleY(${scaleY})`
    }

    equalize()
    document.fonts.ready.then(equalize)
    window.addEventListener('resize', equalize)
    return () => window.removeEventListener('resize', equalize)
  }, [theme])

  return (
    <section id="hero" ref={heroSectionRef} className="relative w-full h-[750vh]">
      <div ref={innerRef} className="hero-inner sticky top-0 h-[125vh] flex flex-col items-center justify-center overflow-hidden">
        <span className="hero-star absolute top-3 left-3 text-3xl z-10 opacity-0 pointer-events-none select-none" aria-hidden="true">★</span>
        <span className="hero-star absolute top-3 right-3 text-3xl z-10 opacity-0 pointer-events-none select-none" aria-hidden="true">★</span>
        <span className="hero-star absolute bottom-3 left-3 text-3xl z-10 opacity-0 pointer-events-none select-none" aria-hidden="true">★</span>
        <span className="hero-star absolute bottom-3 right-3 text-3xl z-10 opacity-0 pointer-events-none select-none" aria-hidden="true">★</span>
        <div className="hero-petals absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className={`petal petal-${i}`} />
          ))}
        </div>
        <div ref={scrollWrapperRef} className="relative z-2 will-change-[transform,opacity]">
          <div className="flex flex-col items-center leading-[0.85] gap-10">
          <span
            ref={micoRef}
            className="hero-text hero-mico font-variable text-(--color-accent) uppercase whitespace-nowrap"
            style={{
              fontSize: '15vw'
            }}
          >
            MICO
          </span>
          <span
            ref={nakaseRef}
            className="hero-text hero-nakase font-variable text-(--color-accent) uppercase whitespace-nowrap"
            style={{
              fontSize: '15vw'
            }}
          >
            NAKASE
          </span>
          </div>
        </div>
      </div>
    </section>
  )
}
