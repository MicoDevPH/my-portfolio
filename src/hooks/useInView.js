import { useEffect, useState } from 'react'

export function useInView(id, threshold = 0.2) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = document.getElementById(id)
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [id, threshold])

  return visible
}
