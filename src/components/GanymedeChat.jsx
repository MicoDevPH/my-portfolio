import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import ganymedeLogo from '../assets/Ganymede.png'

export default function GanymedeChat() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading, send, reset } = useChat()
  const [input, setInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptExiting, setPromptExiting] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const isOpenRef = useRef(isOpen)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  const dismissPrompt = useCallback(() => {
    setPromptExiting(true)
    setTimeout(() => { setShowPrompt(false); setPromptExiting(false) }, 300)
  }, [])

  useEffect(() => {
    const initial = setTimeout(() => {
      if (!isOpenRef.current) { setShowPrompt(true); setTimeout(dismissPrompt, 5000) }
    }, 5000)
    const interval = setInterval(() => {
      if (!isOpenRef.current) { setShowPrompt(true); setTimeout(dismissPrompt, 5000) }
    }, 30000)
    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [dismissPrompt])

  const handlePromptClick = () => { dismissPrompt(); setIsOpen(true) }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300) }, [isOpen])

  const handleSend = () => { const text = input.trim(); if (!text || isLoading) return; send(text); setInput('') }
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }
  const handleToggle = () => setIsOpen((o) => !o)

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-999 w-[380px] max-h-[min(560px,calc(100vh-128px))] h-[min(560px,calc(100vh-128px))] bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-[0_8px_40px_rgb(0_0_0_/_0.4)] flex flex-col overflow-hidden animate-ganymede-slide-up origin-bottom-right box-border
          max-md:right-2 max-md:left-2 max-md:bottom-[76px] max-md:w-[calc(100vw-16px)] max-md:max-h-[min(480px,calc(100vh-100px))] max-md:h-auto max-md:rounded-xl
          max-[481px]:right-4 max-[481px]:w-[360px] max-[481px]:max-h-[min(500px,calc(100vh-128px))] max-[481px]:h-auto"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border) shrink-0 max-md:px-3.5 max-md:py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-(--color-accent) flex items-center justify-center shrink-0 overflow-hidden">
                <img src={ganymedeLogo} alt="Ganymede" className="w-[70%] h-[70%] object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-(--color-text-h) leading-[1.2] max-md:text-sm">Ganymede v1.2</span>
                <span className="text-[11px] text-(--color-text) tracking-[0.03em] max-md:text-[10px]">powered by Mokusei AI</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded-md border border-(--color-border) bg-transparent text-(--color-text) text-xs font-semibold cursor-pointer transition-[background,color] duration-200 hover:bg-(--color-social-bg) hover:text-(--color-text-h) shrink-0" onClick={reset} aria-label="New conversation">+ New</button>
              <button className="w-8 h-8 rounded-full border-none bg-transparent text-(--color-text) cursor-pointer flex items-center justify-center text-lg transition-[background,color] duration-200 hover:bg-(--color-social-bg) hover:text-(--color-text-h) shrink-0" onClick={handleToggle} aria-label="Close chat">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 text-left max-md:px-3 max-md:py-2.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-(--color-border) [&::-webkit-scrollbar-thumb]:rounded">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-[1.55] break-words whitespace-pre-wrap animate-ganymede-msg-in ${
                  msg.role === 'user'
                    ? 'self-end bg-(--color-accent) text-white rounded-br'
                    : 'self-start bg-(--color-social-bg) text-(--color-text) border border-(--color-border) rounded-bl [&_strong]:text-(--color-accent) [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-(--color-text-h) [&_h3]:my-2 [&_h3]:mb-1 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:pl-5 [&_li]:mb-0.5 [&_code]:text-[13px] [&_code]:bg-(--color-code-bg) [&_code]:px-1 [&_code]:py-px [&_code]:rounded [&_code]:font-mono [&_a]:text-(--color-accent) [&_a]:underline'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1 px-3.5 py-2.5 self-start bg-(--color-social-bg) border border-(--color-border) rounded-xl rounded-bl">
                <span className="w-[7px] h-[7px] rounded-full bg-(--color-text) opacity-50 animate-ganymede-dot-bounce" />
                <span className="w-[7px] h-[7px] rounded-full bg-(--color-text) opacity-50 animate-ganymede-dot-bounce [animation-delay:0.2s]" />
                <span className="w-[7px] h-[7px] rounded-full bg-(--color-text) opacity-50 animate-ganymede-dot-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-(--color-border) shrink-0 max-md:px-2.5 max-md:py-2">
            <input
              ref={inputRef}
              className="flex-1 px-3.5 py-2.5 rounded-[10px] border border-(--color-border) bg-(--color-code-bg) text-(--color-text) text-sm font-sans outline-hidden transition-[border-color] duration-200 placeholder:text-(--color-text) placeholder:opacity-50 focus:border-(--color-accent) max-md:px-3 max-md:py-2 max-md:text-[13px]"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="w-[38px] h-[38px] rounded-full border-none bg-(--color-accent) text-white cursor-pointer flex items-center justify-center shrink-0 transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-accent-hover active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed max-md:w-[34px] max-md:h-[34px]"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[1000] animate-ganymede-float max-sm:bottom-4 max-sm:right-4">
        {showPrompt && (
          <div
            className={`absolute top-1/2 right-[calc(100%+16px)] -translate-y-1/2 bg-(--color-accent) text-white px-[18px] py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer z-10 shadow-accent-md ${
              promptExiting ? 'animate-ganymede-prompt-out' : 'animate-ganymede-prompt-in'
            } max-sm:top-auto max-sm:bottom-[calc(100%+12px)] max-sm:right-0 max-sm:left-auto max-sm:transform-none max-sm:px-4 max-sm:py-2 max-sm:text-[13px]`}
            onClick={handlePromptClick}
            style={{ '--prompt-arrow': '" "' }}
          >
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-(--color-accent) max-sm:top-full max-sm:right-[18px] max-sm:-translate-y-0 max-sm:border-l-transparent max-sm:border-r-transparent max-sm:border-t-[6px] max-sm:border-t-(--color-accent) max-sm:border-b-0" />
            Talk to Ganymede now!
          </div>
        )}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-conic-[from_0deg,var(--color-accent),transparent_30%,var(--color-accent),transparent_60%,var(--color-accent)] animate-ganymede-spin -z-1" />
          <button
            className={`relative z-1 w-14 h-14 max-sm:w-12 max-sm:h-12 rounded-full border-none cursor-pointer flex items-center justify-center shadow-accent-btn transition-[transform,box-shadow] duration-300 select-none p-0 leading-none ${
              isOpen
                ? 'bg-(--color-accent) text-white text-2xl max-sm:text-xl rotate-45 hover:rotate-45 hover:scale-110'
                : 'bg-(--color-accent) text-white hover:scale-110 hover:shadow-accent-xl active:scale-95'
            }`}
            onClick={handleToggle}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
          >
            {isOpen ? '✕' : <img src={ganymedeLogo} alt="Ganymede" className="w-[70%] h-[70%] object-contain block" />}
          </button>
        </div>
      </div>
    </>
  )
}
