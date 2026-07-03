import { forwardRef } from 'react'

const ToriiGate = forwardRef(function ToriiGate(props, ref) {
  const { className = '', ...rest } = props
  return (
    <div ref={ref} className={className} {...rest}>
      <svg
        viewBox="0 0 500 550"
        fill="var(--color-accent, #BC002D)"
        className="w-[80%] max-w-[700px] h-auto"
        aria-hidden="true"
      >
        <rect x="80" y="120" width="36" height="370" rx="4" />
        <rect x="384" y="120" width="36" height="370" rx="4" />
        <path d="M 20 95 Q 250 25 480 95 L 480 130 Q 250 60 20 130 Z" />
        <rect x="65" y="150" width="370" height="28" rx="3" />
        <rect x="70" y="478" width="56" height="32" rx="3" />
        <rect x="374" y="478" width="56" height="32" rx="3" />
      </svg>
    </div>
  )
})

export default ToriiGate
