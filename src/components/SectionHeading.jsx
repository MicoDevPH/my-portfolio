export default function SectionHeading({ number, eyebrow, title, accent, description, visible = true, className = '' }) {
  return (
    <div className={className}>
      <p className="nb-eyebrow m-0 mb-4">
        <span className="text-(--color-red)">No.{String(number).padStart(3, '0')}</span> · {eyebrow}
      </p>
      <h2
        className="font-display font-bold uppercase text-(--color-text) leading-[0.95] m-0 mb-5"
        style={{ fontSize: 'clamp(36px, 6vw, 84px)' }}
      >
        {title}{' '}
        {accent && (
          // Stamps in after the title: grows from the left and settles at a tilt
          <span
            className={`inline-block origin-left bg-(--color-yellow) text-(--color-on-accent) border-[3px] border-(--color-ink) shadow-brutal px-3 transition-[scale,rotate] duration-500 delay-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              visible ? 'scale-100 -rotate-1' : 'scale-x-0 rotate-3'
            }`}
          >
            {accent}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-(--color-muted) max-w-[620px] m-0" style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.7 }}>
          {description}
        </p>
      )}
    </div>
  )
}
