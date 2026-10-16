import { useRef, useState } from 'react'
import aboutMe from '../assets/AboutMe.jpg'

const ATTACKS = [
  {
    cost: ['⚡', '★'],
    name: 'Full Stack',
    damage: 120,
    text: 'Ships a web app from database to UI in a single turn.',
  },
  {
    cost: ['♪', '★'],
    name: 'Drop the Beat',
    damage: 90,
    text: 'Produces an original track. The crowd is hyped.',
  },
]

// Round energy symbol, like the type icons on a real card
function Energy({ symbol, size = 'w-5 h-5 text-[11px]' }) {
  return (
    <span
      className={`${size} inline-flex items-center justify-center rounded-full bg-white border-2 border-[#111] text-[#111] leading-none shrink-0`}
      aria-hidden="true"
    >
      {symbol}
    </span>
  )
}

function CardFront() {
  return (
    <div className="h-full rounded-[14px] bg-(--color-yellow) border-[3px] border-[#111] p-[9px]">
      <div className="h-full flex flex-col rounded-[6px] border-2 border-[#111] bg-[linear-gradient(160deg,#fff7c9_0%,#f9e27a_45%,#f2c94c_100%)] px-3 pt-2 pb-2 text-[#111]">
        {/* Header: stage, name, HP, type */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[6px] px-1 py-0.5 bg-white border border-[#111]">BASIC</span>
          <span className="font-display font-bold text-[20px] leading-none uppercase">Mico</span>
          <span className="ml-auto font-pixel text-[7px]">HP</span>
          <span className="font-display font-bold text-[20px] leading-none text-[#c8281a]">120</span>
          <Energy symbol="⚡" size="w-6 h-6 text-[13px]" />
        </div>

        {/* Artwork in a silver frame */}
        <div className="mt-1.5 flex-1 min-h-[96px] p-[3px] bg-[linear-gradient(135deg,#f4f4f4,#a9a9a9_45%,#ececec_60%,#9a9a9a)] border-2 border-[#111]">
          <img src={aboutMe} alt="Mico Nakase" className="block w-full h-full object-cover object-[50%_25%]" draggable="false" />
        </div>

        {/* Info strip */}
        <div className="mx-3 -mt-px px-2 py-0.5 bg-[linear-gradient(90deg,#c9c9c9,#f2f2f2,#c9c9c9)] border-x-2 border-b-2 border-[#111] text-center text-[8.5px] italic font-semibold">
          No.001 · Developer &amp; Producer · Laguna, PH
        </div>

        {/* Attacks */}
        <div className="mt-2 flex flex-col gap-1.5">
          {ATTACKS.map((a) => (
            <div key={a.name}>
              <div className="flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {a.cost.map((c, i) => (
                    <Energy key={i} symbol={c} />
                  ))}
                </span>
                <span className="font-bold text-[14px] leading-tight">{a.name}</span>
                <span className="ml-auto font-display font-bold text-[18px] leading-none">{a.damage}</span>
              </div>
              <p className="m-0 mt-0.5 text-[10.5px] leading-snug">{a.text}</p>
            </div>
          ))}
        </div>

        {/* Weakness / resistance / retreat */}
        <div className="mt-2 pt-1.5 border-t-2 border-[#111] grid grid-cols-3 text-center text-[8px] font-semibold uppercase">
          <div>
            weakness
            <div className="text-[11px] normal-case">☕ ×2</div>
          </div>
          <div>
            resistance
            <div className="text-[11px] normal-case">🐛 −30</div>
          </div>
          <div>
            retreat
            <div className="flex justify-center gap-0.5 mt-0.5">
              <Energy symbol="★" size="w-3.5 h-3.5 text-[7px]" />
            </div>
          </div>
        </div>

        {/* Flavor text */}
        <p className="m-0 mt-1.5 px-2 py-1 border border-[#111] bg-white/60 text-[9.5px] italic leading-snug">
          Turns coffee into clean code and late nights into beats.
        </p>

        <div className="mt-1 flex justify-between text-[7.5px] font-semibold">
          <span>Illus. Mico Nakase</span>
          <span>001/165 ★</span>
        </div>
      </div>
    </div>
  )
}

function CardBack() {
  return (
    <div className="h-full rounded-[14px] border-[3px] border-[#111] p-[9px] bg-[#1b3d99]">
      <div className="h-full rounded-[6px] border-2 border-[#111] flex flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_45%,#5b8cff_0%,#2a5bd7_40%,#1b3d99_75%)]">
        <span className="pokeball text-[120px] drop-shadow-[6px_6px_0_#111]" aria-hidden="true" />
        <span className="hero-text text-[44px]">MLN.</span>
        <span className="font-pixel text-[8px] text-white/80 uppercase tracking-[0.2em]">Tap to flip</span>
      </div>
    </div>
  )
}

const FLIP_MS = 650

// One side of the card. Shadow and holo live *inside* the face so they turn with it.
function Face({ back = false, children }) {
  return (
    <div
      className="absolute inset-0 rounded-[14px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={{
        transform: back ? 'rotateY(180deg)' : undefined,
        // offset mirrored on the back so it still lands bottom-right once flipped
        boxShadow: `${back ? -8 : 8}px 8px 0 0 var(--color-ink)`,
      }}
    >
      {children}

      {/* Holo foil: rainbow sheen + glare that follow the pointer */}
      <div
        className="absolute inset-0 rounded-[14px] pointer-events-none mix-blend-color-dodge transition-opacity duration-200"
        style={{
          opacity: 'calc(var(--holo, 0) * 0.55)',
          background:
            'linear-gradient(115deg, transparent 20%, rgb(255 80 180 / 0.55) 36%, rgb(80 220 255 / 0.55) 46%, rgb(255 240 90 / 0.55) 56%, transparent 72%)',
          backgroundSize: '250% 250%',
          backgroundPosition: 'var(--mx, 50%) var(--my, 50%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-[14px] pointer-events-none mix-blend-overlay transition-opacity duration-200"
        style={{
          opacity: 'calc(var(--holo, 0) * 0.8)',
          background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.85), transparent 45%)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Pokémon TCG-style card: tilts toward the pointer with a holo shine, click to flip.
// Tilt + flip are one transform written straight from JS (plain numbers, no CSS-var maths),
// on a single rotating element, so they never fight and always apply.
export default function PokeCard({ className = '' }) {
  const rootRef = useRef(null)
  const cardRef = useRef(null)
  const pose = useRef({ rx: 0, ry: 0, flip: 0, flipping: false })
  const [flipped, setFlipped] = useState(false)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const applyPose = () => {
    const { rx, ry, flip } = pose.current
    cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry + flip}deg)`
  }

  const setHolo = (on, px = 0.5, py = 0.5) => {
    const el = cardRef.current
    el.style.setProperty('--holo', on ? '1' : '0')
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }

  const handleMove = (e) => {
    if (reduceMotion || pose.current.flipping || e.pointerType !== 'mouse') return
    const r = rootRef.current.getBoundingClientRect()
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1)
    pose.current.rx = (0.5 - py) * 16
    pose.current.ry = (px - 0.5) * 20
    applyPose()
    setHolo(true, px, py)
  }

  const handleLeave = () => {
    if (pose.current.flipping) return
    pose.current.rx = 0
    pose.current.ry = 0
    applyPose()
    setHolo(false)
  }

  const flip = () => {
    const p = pose.current
    if (p.flipping) return
    const el = cardRef.current

    p.flip = p.flip === 0 ? 180 : 0
    setFlipped(p.flip === 180)

    if (reduceMotion) {
      applyPose()
      return
    }

    p.flipping = true
    p.rx = 0
    p.ry = 0
    setHolo(false)
    // Slower, smooth transition just for the flip, then back to the snappy tilt one
    el.style.transition = `transform ${FLIP_MS}ms cubic-bezier(0.45, 0, 0.2, 1)`
    applyPose()
    // "Pick the card up" while it turns
    rootRef.current.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }],
      { duration: FLIP_MS, easing: 'ease-in-out' },
    )
    setTimeout(() => {
      el.style.transition = ''
      p.flipping = false
    }, FLIP_MS)
  }

  return (
    <div
      ref={rootRef}
      className={`[perspective:1400px] ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Show card front' : 'Flip card'}
        aria-pressed={flipped}
        className="relative w-full aspect-[63/88] select-none [transform-style:preserve-3d] transition-transform duration-150 ease-out"
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
      >
        <Face>
          <CardFront />
        </Face>
        <Face back>
          <CardBack />
        </Face>
      </div>
    </div>
  )
}
