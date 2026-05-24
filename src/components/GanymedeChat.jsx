import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendMessage } from '../services/chatService'
import ganymedeLogo from '../assets/Ganymede.png'
import './GanymedeChat.css'

const STORAGE_KEY = 'ganymede-chat'

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    console.debug('GanymedeChat: localStorage unavailable')
  }
  return []
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    console.debug('GanymedeChat: localStorage unavailable')
  }
}

const WELCOME_MSG = {
  role: 'ai',
  text: "Hey! I'm **Ganymede 1.0**, your personal assistant powered by Mokusei AI. Ask me anything about Mico's work!",
}

export default function GanymedeChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    const saved = loadMessages()
    return saved.length > 0 ? saved : [WELCOME_MSG]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptExiting, setPromptExiting] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messagesRef = useRef(messages)
  const isOpenRef = useRef(isOpen)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  const dismissPrompt = useCallback(() => {
    setPromptExiting(true)
    setTimeout(() => {
      setShowPrompt(false)
      setPromptExiting(false)
    }, 300)
  }, [])

  useEffect(() => {
    const initial = setTimeout(() => {
      if (!isOpenRef.current) {
        setShowPrompt(true)
        setTimeout(dismissPrompt, 5000)
      }
    }, 5000)

    const interval = setInterval(() => {
      if (!isOpenRef.current) {
        setShowPrompt(true)
        setTimeout(dismissPrompt, 5000)
      }
    }, 30000)

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [dismissPrompt])

  const handlePromptClick = () => {
    dismissPrompt()
    setIsOpen(true)
  }

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    saveMessages(messages)
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg = { role: 'user', text }
    const updatedMessages = [...messagesRef.current, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const reply = await sendMessage(text, updatedMessages)
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I ran into an issue. Please try again!' }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleToggle = () => setIsOpen(o => !o)

  return (
    <>
      {isOpen && (
        <div className="ganymede-panel">
          <div className="ganymede-header">
            <div className="ganymede-header-info">
              <div className="ganymede-header-icon"><img src={ganymedeLogo} alt="Ganymede" /></div>
              <div className="ganymede-header-text">
                <span className="ganymede-header-title">Ganymede 1.0</span>
                <span className="ganymede-header-subtitle">powered by Mokusei AI</span>
              </div>
            </div>
            <button className="ganymede-close" onClick={handleToggle} aria-label="Close chat">✕</button>
          </div>

          <div className="ganymede-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ganymede-message ${msg.role}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="ganymede-typing">
                <span className="ganymede-typing-dot" />
                <span className="ganymede-typing-dot" />
                <span className="ganymede-typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ganymede-input-area">
            <input
              ref={inputRef}
              className="ganymede-input"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="ganymede-send"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="ganymede-wrapper">
        {(showPrompt || promptExiting) && (
          <div className={`ganymede-prompt${promptExiting ? ' exiting' : ''}`} onClick={handlePromptClick}>
            Talk to Ganymede now!
          </div>
        )}
        <button
          className={`ganymede-button${isOpen ? ' open' : ''}`}
          onClick={handleToggle}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? '✕' : <img src={ganymedeLogo} alt="Ganymede" />}
        </button>
      </div>
    </>
  )
}
