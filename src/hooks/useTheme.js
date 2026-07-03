import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'japanese' || stored === 'filipino' ? stored : 'japanese'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(() => {
    const next = theme === 'japanese' ? 'filipino' : 'japanese'
    localStorage.setItem('theme', next)
    window.location.reload()
  }, [theme])

  return { theme, toggle }
}
