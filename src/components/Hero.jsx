import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useDialog } from '../hooks/useDialog'

const DIALOG_LINES = [
  'A wild DEVELOPER appeared!',
  "I'm MICO, a Full Stack & Gen AI developer from Laguna, PH.",
  'I build web apps by day and produce music by night.',
  "Right now I'm a Junior AI Engineer at Prosperna, shipping AI-powered tools.",
  'Scroll down to start your adventure!',
]

export default function Hero() {
  const micoRef = useRef(null)
  const nakaseRef = useRef(null)
  const heroSectionRef = useRef(null)
  const scrollWrapperRef = useRef(null)
  // Starts typing once the loading screen has cleared
  const dialog = useDialog(DIALOG_LINES, { startDelay: 2600 })

  useScrollAnimation(heroSectionRef, scrollWrapperRef)

  // Stretch both name lines to exactly match the navbar width
  useEffect(() => {
    const equalize = () => {
      if (!micoRef.current || !nakaseRef.current) return
      const navbar = document.getElementById('navbar')
      if (!navbar) return
      const targetW = navbar.getBoundingClientRect().width
      const vw = window.innerWidth

      const getTextWidth = (el) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return range.getBoundingClientRect().width
      }

      nakaseRef.current.style.fontSize = ''
      micoRef.current.style.fontSize = ''
      micoRef.current.style.transform = ''

      const baseFs = parseFloat(window.getComputedStyle(nakaseRef.current).fontSize)
      const nakaseTextW = getTextWidth(nakaseRef.current)
      const newFsVw = (((baseFs * (targetW / nakaseTextW)) / vw) * 100).toFixed(4)
      nakaseRef.current.style.fontSize = newFsVw + 'vw'
      micoRef.current.style.fontSize = newFsVw + 'vw'

      const scale = (targetW / getTextWidth(micoRef.current)).toFixed(6)
      micoRef.current.style.transformOrigin = '50% 50%'
      micoRef.current.style.transform = `scaleX(${scale})`
    }

    equalize()
    document.fonts.ready.then(equalize)
    window.addEventListener('resize', equalize)
    return () => window.removeEventListener('resize', equalize)
  }, [])

  return (
    <section id="hero" ref={heroSectionRef} className="relative w-full h-[300vh]">
      <div className="halftone sticky top-0 h-[125vh] pt-28 box-border flex flex-col items-center justify-center overflow-hidden border-b-[3px] border-(--color-ink)">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={`floater floater-${i}`}>
              <span className="pokeball" />
            </span>
          ))}
        </div>

        <div ref={scrollWrapperRef} className="relative z-2 flex flex-col items-center will-change-[transform,opacity]">
          <div className="flex flex-col items-center leading-[1.05] gap-[2vw]">
            <span ref={micoRef} className="hero-text uppercase whitespace-nowrap" style={{ fontSize: '12vw' }}>
              MICO
            </span>
            <span ref={nakaseRef} className="hero-text uppercase whitespace-nowrap" style={{ fontSize: '12vw' }}>
              NAKASE
            </span>
          </div>

          {/* Click / Enter / Space advances the dialog, like the games */}
          <div
            role="button"
            tabIndex={0}
            aria-label={dialog.isLast ? 'Dialog' : 'Next line'}
            className="nb-dialog mt-14 w-[min(640px,88vw)] px-7 py-6 text-left select-none"
            onClick={dialog.advance}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                dialog.advance()
              }
            }}
          >
            <p className="font-pixel text-[12px] leading-[2] text-(--color-text) m-0 min-h-[4em]" aria-live="polite">
              {dialog.text}
            </p>
            {dialog.done && !dialog.isLast && (
              <span className="absolute right-5 bottom-3 font-pixel text-[10px] text-(--color-red) animate-blink" aria-hidden="true">
                ▼
              </span>
            )}
          </div>

          <p className="nb-eyebrow mt-10 m-0 animate-bob">Scroll to start ↓</p>
        </div>
      </div>
    </section>
  )
}
