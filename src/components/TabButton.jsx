export default function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`font-sans text-sm font-medium tracking-[0.03em] px-7 py-2.5 rounded-[10px] border cursor-pointer transition-all duration-250 sm:px-5 sm:py-2 sm:text-[13px] ${
        active
          ? 'bg-(--color-accent) text-white border-(--color-accent)'
          : 'bg-(--color-social-bg) text-(--color-text) border-(--color-border) hover:text-(--color-accent) hover:border-(--color-accent)'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
