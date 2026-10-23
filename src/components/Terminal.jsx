import { useEffect, useRef, useState } from 'react'
import { complete, runCommand } from '../lib/terminal'

const WELCOME = [
  { text: 'MICO OS v1.0 — portfolio terminal', tone: 'accent' },
  { text: 'Type "help" to see what you can do.', tone: 'muted' },
  { text: '' },
]

const TONES = {
  accent: 'text-(--color-yellow)',
  error: 'text-[#ff7a5c]',
  muted: 'text-[#9a968a]',
  input: 'text-white',
}

// Opens with ~ or Ctrl/Cmd+K (or the navbar button). `ctx` gives commands the
// content and the actions they can trigger on the page.
export default function Terminal({ open, onOpen, onClose, ctx }) {
  const [lines, setLines] = useState(WELCOME)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1) // -1 = typing a new line
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  // Global shortcuts: ~ (outside form fields) and Ctrl/Cmd+K toggle, Esc closes
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.closest?.('input, textarea, select, [contenteditable]')
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
        else onOpen()
      } else if (!open && !typing && (e.key === '`' || e.key === '~')) {
        e.preventDefault()
        onOpen()
      } else if (open && e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpen, onClose])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines, open])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const value = input.trim()
    setInput('')
    setHistoryIndex(-1)
    const echo = { text: `> ${input}`, tone: 'input' }
    if (!value) {
      setLines((l) => [...l, echo])
      return
    }
    setHistory((h) => [...h, value])
    const result = runCommand(value, ctx)
    if (result.clear) setLines([])
    else setLines((l) => [...l, echo, ...result.lines, { text: '' }])
    if (result.action) {
      onClose()
      // Let the overlay unmount first so scrolling targets the page
      requestAnimationFrame(result.action)
    }
  }

  const onInputKey = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const completed = complete(input)
      if (completed) setInput(completed)
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown' && historyIndex !== -1) {
      e.preventDefault()
      const next = historyIndex + 1
      setHistoryIndex(next < history.length ? next : -1)
      setInput(next < history.length ? history[next] : '')
    }
  }

  return (
    <div className="fixed inset-0 z-[1002] bg-black/60 flex items-center justify-center p-4 animate-menu-fade" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="flex flex-col w-[min(780px,100%)] h-[min(540px,75vh)] bg-[#111] text-[#ece8d9] border-[3px] border-[#111] shadow-[6px_6px_0_0_var(--color-yellow)]"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.focus()
        }}
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-(--color-yellow) text-(--color-on-accent) border-b-[3px] border-[#111]">
          <span className="flex items-center gap-2 font-pixel text-[10px] uppercase">
            <span className="pokeball text-[14px]" aria-hidden="true" />
            mico@portfolio: ~
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="flex items-center justify-center w-7 h-7 border-2 border-[#111] bg-white text-black font-pixel text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[14px] leading-[1.6]" aria-live="polite">
          {lines.map((line, i) =>
            line.href ? (
              <a
                key={i}
                href={line.href}
                target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="block whitespace-pre-wrap break-words text-[#7fb2ff] underline underline-offset-2"
              >
                {line.text}
              </a>
            ) : (
              <div key={i} className={`whitespace-pre-wrap break-words min-h-[1.6em] ${TONES[line.tone] ?? ''}`}>
                {line.text}
              </div>
            ),
          )}

          <form onSubmit={submit} className="flex items-center gap-2">
            <span className="text-(--color-green)" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              aria-label="Command"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-white font-mono text-[14px] caret-(--color-yellow)"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
