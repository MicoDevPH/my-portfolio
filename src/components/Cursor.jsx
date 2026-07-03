import { useEffect, useRef } from 'react'

export default function Cursor() {
  const shapeRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const shape = shapeRef.current
    const ring = ringRef.current
    if (!shape || !ring) return

    const root = document.documentElement

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let onInput = false
    let onInteractive = false
    let hidden = false
    let rafId

    const INPUT_SEL = 'input, textarea, select, [contenteditable]'
    const CLICK_SEL = 'a, button, [role="button"], [role="link"], [role="tab"]'

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }, { passive: true })

    document.addEventListener('mouseleave', () => { hidden = true }, { passive: true })
    document.addEventListener('mouseenter', () => { hidden = false }, { passive: true })

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      const elem = document.elementFromPoint(mouseX, mouseY)
      if (elem) {
        const isNowInput = elem.closest(INPUT_SEL) !== null
        if (isNowInput !== onInput) {
          onInput = isNowInput
          shape.style.display = onInput ? 'none' : ''
          ring.style.display = onInput ? 'none' : ''
          root.style.cursor = onInput ? 'auto' : ''
        }

        if (!onInput) {
          const isNowInteractive = elem.closest(CLICK_SEL) !== null
          if (isNowInteractive !== onInteractive) {
            onInteractive = isNowInteractive
            ring.classList.toggle('cursor-ring--hover', isNowInteractive)
          }
        }
      }

      const zoom = parseFloat(getComputedStyle(root).getPropertyValue('--cursor-zoom-inverse')) || 1

      shape.style.left = (mouseX * zoom) + 'px'
      shape.style.top = (mouseY * zoom) + 'px'
      ring.style.left = (ringX * zoom) + 'px'
      ring.style.top = (ringY * zoom) + 'px'

      const theme = root.getAttribute('data-theme') || 'japanese'
      shape.setAttribute('data-cursor-theme', theme)
      ring.setAttribute('data-cursor-theme', theme)

      shape.style.opacity = hidden ? '0' : '1'
      ring.style.opacity = hidden ? '0' : '1'

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      root.style.cursor = ''
    }
  }, [])

  return (
    <>
      <span className="cursor-shape" ref={shapeRef} data-cursor-theme="japanese" />
      <span className="cursor-ring" ref={ringRef} data-cursor-theme="japanese" />
    </>
  )
}
