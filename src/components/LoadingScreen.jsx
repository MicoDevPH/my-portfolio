export default function LoadingScreen({ fadeOut, columnsReveal }) {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div className="flex w-full h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-full border-x-[3px] border-(--color-ink) transition-transform duration-700 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] ${
              i % 2 ? 'bg-(--color-yellow)' : 'bg-(--color-bg)'
            }`}
            style={{
              width: '20%',
              transform: columnsReveal ? 'translateY(-100%)' : 'translateY(0)',
              transitionDelay: columnsReveal ? `${i * 90}ms` : '0ms',
            }}
          />
        ))}
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-10 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="pokeball animate-wobble origin-bottom" style={{ fontSize: 'clamp(72px, 10vw, 110px)' }} aria-hidden="true" />
        <div className="nb-dialog px-6 py-4 animate-logo-in [animation-delay:0.2s]">
          <span className="font-pixel text-[12px] text-(--color-text) leading-[1.8]">
            Loading MLN
            <span className="animate-dot-pulse">.</span>
            <span className="animate-dot-pulse [animation-delay:0.2s]">.</span>
            <span className="animate-dot-pulse [animation-delay:0.4s]">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}
