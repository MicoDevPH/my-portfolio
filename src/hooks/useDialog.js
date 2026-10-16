import { useState, useEffect, useCallback } from 'react'

// Game-style dialog: types one line, waits for the player to advance.
// Advancing mid-line finishes it instantly; the last line stays put.
export function useDialog(lines, { speed = 35, startDelay = 0 } = {}) {
  const [started, setStarted] = useState(startDelay === 0)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)

  const line = lines[index]
  const done = count >= line.length

  useEffect(() => {
    if (started) return
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [started, startDelay])

  useEffect(() => {
    if (!started || done) return
    const t = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(t)
  }, [started, count, done, speed])

  const advance = useCallback(() => {
    if (!done) {
      setStarted(true)
      setCount(line.length)
      return
    }
    if (index < lines.length - 1) {
      setIndex((i) => i + 1)
      setCount(0)
    }
  }, [done, line.length, index, lines.length])

  return {
    text: line.slice(0, count),
    done,
    isLast: index === lines.length - 1,
    advance,
  }
}
