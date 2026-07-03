import { useState, useEffect } from 'react'

export function useTypewriter(strings, paused, { typingSpeed = 55, deletingSpeed = 30, pauseDuration = 2000 } = {}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (paused) return

    const currentString = strings[currentIndex]

    if (!isDeleting) {
      if (displayText.length < currentString.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timeout)
      }
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, deletingSpeed)
      return () => clearTimeout(timeout)
    }

    setIsDeleting(false)
    setCurrentIndex((prev) => (prev + 1) % strings.length)
  }, [displayText, currentIndex, isDeleting, paused, strings, typingSpeed, deletingSpeed, pauseDuration])

  return displayText
}
