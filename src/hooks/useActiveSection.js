import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] || '')

  useEffect(() => {
    const onScroll = () => {
      let current = sectionIds[0] || ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 150) {
          current = id
        }
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds])

  return active
}
