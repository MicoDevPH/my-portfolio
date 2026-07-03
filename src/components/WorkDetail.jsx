import { techIcons } from '../constants/techIcons'
import Icon from './Icon'

export default function WorkDetail({ work, onBack }) {
  if (!work) return null

  return (
    <div className="min-h-screen bg-(--color-bg) overflow-y-auto">
      <div className="relative w-full max-h-[60vh] overflow-hidden md:max-h-[40vh]">
        <button
          className="absolute top-5 left-5 z-10 flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.6)] text-white cursor-pointer transition-[background] duration-200 hover:bg-[rgba(0,0,0,0.85)]"
          onClick={onBack}
          aria-label="Back"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <img src={work.img} alt={work.title} className="w-full h-full object-cover block" />
      </div>
      <div className="max-w-[800px] mx-auto px-12 py-16 pb-30 md:px-5 md:py-10 md:pb-20">
        <h1 className="font-heading font-black text-(--color-text-h) uppercase tracking-[-0.02em] m-0 mb-4 leading-[0.92]"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
          {work.title}
        </h1>
        <div className="flex items-center gap-2.5 mb-8 flex-wrap">
          <span className="text-sm font-semibold text-(--color-accent) bg-(--color-accent-bg) border border-(--color-accent-border) px-4 py-1 rounded-full">{work.year}</span>
          {work.tags?.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-(--color-social-bg) border border-(--color-border) text-(--color-text) text-xs font-medium tracking-[0.03em] whitespace-nowrap">
              {techIcons[tag]}
              {tag}
            </span>
          ))}
        </div>
        <p className="m-0 mb-10 text-(--color-text)" style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: '1.85' }}>
          {work.longDesc}
        </p>
        {work.features && work.features.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-(--color-text-h) uppercase tracking-[-0.01em] m-0 mb-6"
              style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>
              Key Features
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {work.features.map((f, i) => (
                <li key={i} className="relative pl-7 text-(--color-text) before:absolute before:left-0 before:top-2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-(--color-accent) before:opacity-70"
                  style={{ fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: '1.65' }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
