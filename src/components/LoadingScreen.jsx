import { useEffect, useState } from 'react'

// What the dex screen types out, line by line
const ENTRY = ['BOOTING...', 'No.001', 'MICO NAKASE', 'TYPE: DEV / MUSIC', 'JUNIOR AI ENGINEER']
const TOTAL_CHARS = ENTRY.reduce((n, line) => n + line.length, 0)
// Character offset where each line starts in the typed stream
const LINE_STARTS = ENTRY.map((_, i) => ENTRY.slice(0, i).reduce((n, l) => n + l.length, 0))
const TYPE_MS = 22
const TYPE_DELAY_MS = 350

// Game Boy LCD palette
const LCD_BG = '#9bbc0f'
const LCD_INK = '#0f380f'

// Pokédex-style boot screen; exits with the device sliding away, then the backdrop splits open
export default function LoadingScreen({ fadeOut, columnsReveal }) {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => setTyped((n) => Math.min(n + 1, TOTAL_CHARS)), TYPE_MS)
    }, TYPE_DELAY_MS)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [])

  // Split the typed character count back into per-line text
  const lines = ENTRY.map((line, i) => line.slice(0, Math.max(0, typed - LINE_STARTS[i])))
  const activeLine = lines.findIndex((l, i) => l.length < ENTRY[i].length)

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Exit: the backdrop splits along a Pokéball-style seam — top half up, bottom half down */}
      <div
        className={`halftone absolute inset-x-0 top-0 h-1/2 border-b-[5px] border-(--color-ink) transition-transform duration-700 [transition-timing-function:cubic-bezier(0.7,0,0.3,1)] ${
          columnsReveal ? '-translate-y-[101%]' : 'translate-y-0'
        }`}
      />
      <div
        className={`halftone absolute inset-x-0 bottom-0 h-1/2 border-t-[5px] border-(--color-ink) transition-transform duration-700 [transition-timing-function:cubic-bezier(0.7,0,0.3,1)] ${
          columnsReveal ? 'translate-y-[101%]' : 'translate-y-0'
        }`}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        {/* The device */}
        <div
          className={`w-[min(480px,92vw)] bg-(--color-red) border-[3px] border-(--color-ink) shadow-brutal-lg p-5 sm:p-6 transition-[translate,opacity] duration-500 ease-in ${
            fadeOut ? '-translate-y-[120vh]' : 'translate-y-0 animate-logo-in'
          }`}
        >
          {/* Top bar: lens, status LEDs, name */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-12 shrink-0 rounded-full bg-(--color-blue) border-[3px] border-[#111] shadow-[inset_-4px_-4px_0_rgb(0_0_0/0.25),inset_4px_4px_0_rgb(255_255_255/0.35)]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff6b6b] border-2 border-[#111] animate-blink" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#ffd60a] border-2 border-[#111] animate-blink [animation-delay:0.33s]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#4fd27a] border-2 border-[#111] animate-blink [animation-delay:0.66s]" />
            <span className="ml-auto font-pixel text-[11px] sm:text-[13px] text-white [text-shadow:2px_2px_0_#111]">MICODEX</span>
          </div>

          {/* LCD screen with scanlines */}
          <div className="border-[3px] border-[#111] bg-[#e8e8e8] p-3">
            <div
              className="relative h-[180px] p-4 overflow-hidden border-2 border-[#111]"
              style={{ background: LCD_BG, color: LCD_INK }}
            >
              <div className="font-pixel text-[10px] sm:text-[12px] leading-[2.1]">
                {lines.map((line, i) => (
                  <div key={i} className={i === 2 ? 'text-[13px] sm:text-[15px]' : ''}>
                    {line}
                    {i === activeLine && <span className="animate-blink">█</span>}
                  </div>
                ))}
                {activeLine === -1 && <span className="animate-blink">▼</span>}
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'repeating-linear-gradient(to bottom, rgb(15 56 15 / 0.12) 0 2px, transparent 2px 4px)' }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Controls: d-pad + A/B */}
          <div className="flex items-center justify-between mt-5 px-2">
            <div className="relative w-14 h-14" aria-hidden="true">
              <span className="absolute left-1/2 top-0 -translate-x-1/2 w-[18px] h-full bg-[#111]" />
              <span className="absolute top-1/2 left-0 -translate-y-1/2 h-[18px] w-full bg-[#111]" />
            </div>
            <div className="flex gap-3" aria-hidden="true">
              <span className="w-9 h-9 rounded-full bg-[#111] border-[3px] border-[#111] shadow-[inset_3px_3px_0_rgb(255_255_255/0.2)] translate-y-2" />
              <span className="w-9 h-9 rounded-full bg-[#111] border-[3px] border-[#111] shadow-[inset_3px_3px_0_rgb(255_255_255/0.2)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
