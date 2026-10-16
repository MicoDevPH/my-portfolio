import { useState, useEffect, useCallback } from 'react'

// Game-style dialog: types one line, then waits for the player to advance.
// Advancing mid-line finishes it instantly. With `autoAdvanceMs`, it also moves on by
// itself after a finished line has been on screen that long; with `loop`, the last
// line wraps back to the first (after `loopDelayMs`).
export function useDialog(lines, { speed = 35, startDelay = 0, autoAdvanceMs = 0, loop = false, loopDelayMs = 0 } = {}) {
  const [started, setStarted] = useState(startDelay === 0)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)

  const line = lines[index]
  const done = count >= line.length
  const isLast = index === lines.length - 1

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

  const next = useCallback(() => {
    if (!isLast) {
      setIndex((i) => i + 1)
      setCount(0)
    } else if (loop) {
      setIndex(0)
      setCount(0)
    }
  }, [isLast, loop])

  const advance = useCallback(() => {
    if (!done) {
      setStarted(true)
      setCount(line.length)
      return
    }
    next()
  }, [done, line.length, next])

  // Auto-advance once a line is fully shown. Any click changes index/count,
  // which re-runs this effect and restarts the countdown.
  useEffect(() => {
    if (!autoAdvanceMs || !done) return
    if (isLast && !loop) return
    const t = setTimeout(next, isLast ? autoAdvanceMs + loopDelayMs : autoAdvanceMs)
    return () => clearTimeout(t)
  }, [autoAdvanceMs, done, isLast, loop, loopDelayMs, next, index])

  return {
    text: line.slice(0, count),
    done,
    isLast,
    advance,
  }
}
