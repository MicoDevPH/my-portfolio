import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Literal class names so Tailwind can see them at build time
const REVEAL_DELAYS = {
  '0s': 'delay-0',
  '0.1s': 'delay-100',
  '0.15s': 'delay-150',
  '0.2s': 'delay-200',
  '0.25s': 'delay-250',
  '0.3s': 'delay-300',
  '0.4s': 'delay-400',
}

// Hidden state per entrance style; all share the same timing
const REVEAL_HIDDEN = {
  up: 'opacity-0 translate-y-8',
  left: 'opacity-0 -translate-x-16',
  right: 'opacity-0 translate-x-16',
  pop: 'opacity-0 scale-75',
  open: 'opacity-0 scale-y-0',
}

// Shared scroll-in animation so every section enters the same way
export function revealClass(visible, delay = '0s', variant = 'up') {
  return cn(
    'transition-[opacity,translate,scale] duration-500 ease-out',
    REVEAL_DELAYS[delay],
    visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : REVEAL_HIDDEN[variant],
  )
}

// Per-item delay for staggered lists (capped so long lists do not drag)
export function staggerStyle(index, step = 50, max = 600) {
  return { transitionDelay: `${Math.min(index * step, max)}ms` }
}
