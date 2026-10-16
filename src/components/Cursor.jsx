import { useEffect, useRef } from 'react'

// Pixel sprites — K outline, Y yellow, W shine, . transparent
const ARROW = [
  'K...........',
  'KK..........',
  'KYK.........',
  'KWYK........',
  'KWYYK.......',
  'KWYYYK......',
  'KWYYYYK.....',
  'KWYYYYYK....',
  'KWYYYYYYK...',
  'KYYYYYYYYK..',
  'KYYYYYYYYYK.',
  'KYYYYYYKKKKK',
  'KYYYKYYK....',
  'KYYKKYYK....',
  'KYK..KYYK...',
  'KK...KYYK...',
  'K.....KYYK..',
  '......KYYK..',
  '.......KK...',
]

const HAND = [
  '....KK..........',
  '...KWYK.........',
  '...KWYK.........',
  '...KWYK.........',
  '...KWYKKK.......',
  '...KWYKYYKKK....',
  '...KYYKYYKYYKK..',
  'KK.KYYKYYKYYKYK.',
  'KYKKYYYYYYYYKYK.',
  'KYYKYYYYYYYYYYK.',
  '.KYYYYYYYYYYYYK.',
  '..KYYYYYYYYYYYK.',
  '..KYYYYYYYYYYK..',
  '...KYYYYYYYYYK..',
  '....KYYYYYYYK...',
  '....KYYYYYYYK...',
  '....KKKKKKKKK...',
]

const COLORS = { K: '#111111', Y: '#ffd60a', W: '#ffffff' }

// Merge horizontal runs of the same colour into single rects
function toRects(sprite) {
  return sprite.flatMap((row, y) => {
    const rects = []
    let x = 0
    while (x < row.length) {
      const c = row[x]
      let w = 1
      while (row[x + w] === c) w++
      if (COLORS[c]) rects.push({ x, y, w, fill: COLORS[c] })
      x += w
    }
    return rects
  })
}

const ARROW_RECTS = toRects(ARROW)
const HAND_RECTS = toRects(HAND)

function Sprite({ rects, cols, rows, className }) {
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height="1" fill={r.fill} />
      ))}
    </svg>
  )
}

export default function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const root = document.documentElement

    let mouseX = 0, mouseY = 0
    let onInput = false
    let onInteractive = false
    let hidden = false
    let rafId

    const INPUT_SEL = 'input:not([type="range"]), textarea, [contenteditable]'
    const CLICK_SEL = 'a, button, input[type="range"], [role="button"], [role="link"], [role="tab"]'

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const onLeave = () => { hidden = true }
    const onEnter = () => { hidden = false }
    const onDown = () => cursor.classList.add('cursor--down')
    const onUp = () => cursor.classList.remove('cursor--down')

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })

    const loop = () => {
      const elem = document.elementFromPoint(mouseX, mouseY)
      if (elem) {
        const isNowInput = elem.closest(INPUT_SEL) !== null
        if (isNowInput !== onInput) {
          onInput = isNowInput
          cursor.style.display = onInput ? 'none' : ''
          root.style.cursor = onInput ? 'auto' : ''
        }

        if (!onInput) {
          const isNowInteractive = elem.closest(CLICK_SEL) !== null
          if (isNowInteractive !== onInteractive) {
            onInteractive = isNowInteractive
            cursor.classList.toggle('cursor--pointer', isNowInteractive)
          }
        }
      }

      const zoom = parseFloat(getComputedStyle(root).getPropertyValue('--cursor-zoom-inverse')) || 1

      cursor.style.left = (mouseX * zoom) + 'px'
      cursor.style.top = (mouseY * zoom) + 'px'
      cursor.style.opacity = hidden ? '0' : '1'

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      root.style.cursor = ''
    }
  }, [])

  return (
    <span className="cursor" ref={cursorRef}>
      <Sprite rects={ARROW_RECTS} cols={12} rows={19} className="cursor-arrow" />
      <Sprite rects={HAND_RECTS} cols={16} rows={17} className="cursor-hand" />
    </span>
  )
}
