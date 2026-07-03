import { useEffect } from 'react'

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function useScrollAnimation(sectionRef, textWrapperRef) {
  useEffect(() => {
    const isFilipino = document.documentElement.getAttribute('data-theme') === 'filipino'
    if (isFilipino) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId

    const loop = () => {
      if (!sectionRef.current || !textWrapperRef.current) {
        rafId = requestAnimationFrame(loop)
        return
      }

      const scrollY = window.scrollY
      const offsetTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      const winH = window.innerHeight
      const totalScroll = sectionHeight - winH
      const raw = totalScroll > 0
        ? Math.max(0, Math.min(1, (scrollY - offsetTop) / totalScroll))
        : 0

      const P1_END = 0.85

      let textScale = 0
      let textOpacity = 0
      let textTranslateZ = 0
      let textRotateX = 0
      let textTranslateY = 0

      if (raw <= P1_END) {
        const t = raw / P1_END
        const e = t * t * t
        textScale = lerp(1, 3, e)
        textTranslateZ = lerp(0, 150, e)
        textRotateX = lerp(0, -6, e)
        textTranslateY = lerp(0, -40, e)
        textOpacity = lerp(1, 0, e)
      }

      if (raw <= P1_END) {
        textWrapperRef.current.style.transform = [
          'perspective(800px)',
          `translateZ(${textTranslateZ}px)`,
          `rotateX(${textRotateX}deg)`,
          `scale(${textScale})`,
          `translateY(${textTranslateY}px)`,
        ].join(' ')
        textWrapperRef.current.style.opacity = textOpacity
      } else {
        textWrapperRef.current.style.transform = 'scale(0)'
        textWrapperRef.current.style.opacity = 0
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [sectionRef, textWrapperRef])
}
