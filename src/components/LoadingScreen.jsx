export default function LoadingScreen({ fadeOut, columnsReveal }) {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div className="flex w-full h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-full bg-(--color-bg) transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)]"
            style={{
              width: '20%',
              transform: columnsReveal ? 'translateY(-100%)' : 'translateY(0)',
              transitionDelay: columnsReveal ? `${i * 100}ms` : '0ms',
            }}
          />
        ))}
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-10 transition-opacity duration-[400ms] ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      >
        <span
          className="font-serif font-semibold text-(--color-accent) tracking-[0.06em] leading-none animate-logo-in"
          style={{ fontSize: 'clamp(64px, 12vw, 120px)' }}
        >
          MLN.
        </span>
        <div className="flex gap-2.5 animate-logo-in [animation-delay:0.3s]">
          <span className="w-[7px] h-[7px] rounded-full bg-(--color-accent) opacity-30 animate-dot-pulse" />
          <span className="w-[7px] h-[7px] rounded-full bg-(--color-accent) opacity-30 animate-dot-pulse [animation-delay:0.2s]" />
          <span className="w-[7px] h-[7px] rounded-full bg-(--color-accent) opacity-30 animate-dot-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}
