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
        <div className="fixed bottom-24 right-6 z-999 w-[380px] h-[min(560px,calc(100vh-128px))] nb-box shadow-brutal-lg flex flex-col overflow-hidden animate-ganymede-slide-up box-border
          max-md:right-2 max-md:left-2 max-md:bottom-[84px] max-md:w-auto max-md:h-[min(480px,calc(100vh-100px))]"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-(--color-yellow) text-(--color-on-accent) border-b-[3px] border-(--color-ink) shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center shrink-0 overflow-hidden">
                <img src={ganymedeLogo} alt="Ganymede" className="w-[70%] h-[70%] object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-pixel text-[11px] leading-[1.4]">Ganymede v1.2</span>
                <span className="text-[11px] font-medium">powered by Mokusei AI</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="px-2 py-1 border-2 border-black bg-white text-black font-pixel text-[8px] cursor-pointer shrink-0 hover:-translate-y-0.5 transition-transform" onClick={reset} aria-label="New conversation">+ New</button>
              <button className="w-8 h-8 border-2 border-black bg-white text-black cursor-pointer flex items-center justify-center text-base shrink-0 hover:-translate-y-0.5 transition-transform" onClick={handleToggle} aria-label="Close chat">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 text-left bg-(--color-bg) [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-(--color-ink)">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] px-3.5 py-2.5 border-2 border-(--color-ink) text-sm leading-[1.55] break-words whitespace-pre-wrap animate-ganymede-msg-in ${
                  msg.role === 'user'
                    ? 'self-end bg-(--color-yellow) text-(--color-on-accent) shadow-brutal-sm'
                    : 'self-start bg-(--color-surface) text-(--color-text) shadow-brutal-sm [&_strong]:bg-(--color-yellow) [&_strong]:text-(--color-on-accent) [&_strong]:px-0.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:my-2 [&_h3]:mb-1 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:pl-5 [&_li]:mb-0.5 [&_code]:text-[13px] [&_code]:bg-(--color-sunken) [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_a]:text-(--color-blue) [&_a]:underline'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1.5 px-3.5 py-3 self-start bg-(--color-surface) border-2 border-(--color-ink) shadow-brutal-sm">
                <span className="w-2 h-2 bg-(--color-text) animate-ganymede-dot-bounce" />
                <span className="w-2 h-2 bg-(--color-text) animate-ganymede-dot-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-(--color-text) animate-ganymede-dot-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 px-3 py-3 border-t-[3px] border-(--color-ink) shrink-0">
            <input
              ref={inputRef}
              className="nb-input flex-1 py-2.5 text-sm border-2 focus:shadow-brutal-sm focus:translate-0"
              type="text"
              placeholder="Ask me anything..."
              aria-label="Message Ganymede"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="w-11 h-11 border-2 border-(--color-ink) bg-(--color-yellow) text-(--color-on-accent) cursor-pointer flex items-center justify-center shrink-0 shadow-brutal-sm nb-press disabled:opacity-40 disabled:cursor-not-allowed"
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
            className={`nb-dialog absolute top-1/2 right-[calc(100%+16px)] -translate-y-1/2 px-4 py-3 font-pixel text-[9px] leading-[1.6] text-(--color-text) whitespace-nowrap cursor-pointer z-10 ${
              promptExiting ? 'animate-ganymede-prompt-out' : 'animate-ganymede-prompt-in'
            } max-sm:top-auto max-sm:bottom-[calc(100%+14px)] max-sm:right-0 max-sm:transform-none`}
            onClick={handlePromptClick}
          >
            Talk to Ganymede now! <span className="text-(--color-red) animate-blink">▶</span>
          </div>
        )}
        <button
          className={`w-14 h-14 max-sm:w-12 max-sm:h-12 border-[3px] border-(--color-ink) cursor-pointer flex items-center justify-center bg-(--color-yellow) text-(--color-on-accent) shadow-brutal nb-press select-none p-0 leading-none ${
            isOpen ? 'text-2xl' : ''
          }`}
          onClick={handleToggle}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? '✕' : <img src={ganymedeLogo} alt="Ganymede" className="w-[70%] h-[70%] object-contain block" />}
        </button>
      </div>
    </>
  )
}
