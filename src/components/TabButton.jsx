export default function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`nb-btn px-5 py-3 text-[10px] sm:px-6 ${
        active ? 'nb-btn-yellow translate-x-1 translate-y-1 shadow-none' : 'nb-press'
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && <span aria-hidden="true">▶</span>}
      {children}
    </button>
  )
}
