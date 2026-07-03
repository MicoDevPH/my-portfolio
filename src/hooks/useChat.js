import { useState, useEffect, useRef, useCallback } from 'react'
import { sendMessage } from '../services/chatService'

const STORAGE_KEY = 'ganymede-chat'

const WELCOME_MSG = {
  role: 'ai',
  text: "Hey! I'm **Ganymede v1.2**, your personal assistant powered by Mokusei AI. Ask me anything about Mico's work!",
  id: 'welcome',
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // localStorage unavailable
  }
  return []
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // localStorage unavailable
  }
}

export function useChat() {
  const [messages, setMessages] = useState(() => {
    const saved = loadMessages()
    return saved.length > 0 ? saved : [WELCOME_MSG]
  })
  const [isLoading, setIsLoading] = useState(false)
  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  const send = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return
      const userMsg = { role: 'user', text, id: Date.now().toString() }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      try {
        const reply = await sendMessage(text, [...messagesRef.current, userMsg])
        setMessages((prev) => [...prev, { role: 'ai', text: reply, id: Date.now().toString() }])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Sorry, I ran into an issue. Please try again!',
            id: Date.now().toString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([WELCOME_MSG])
  }, [])

  return { messages, isLoading, send, reset }
}
