import { techIcons } from '../constants/techIcons'
import Icon from './Icon'

export default function WorkDetail({ work, onBack }) {
  if (!work) return null

  return (
    <div className="min-h-screen halftone overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-6 pt-8 pb-24 max-sm:px-4">
        <button className="nb-btn nb-press mb-8" onClick={onBack} aria-label="Back">
          <Icon name="chevronLeft" size={16} />
          Back
        </button>

        <div className="nb-box shadow-brutal-lg overflow-hidden">
          <img src={work.img} alt={work.title} className="w-full max-h-[60vh] object-cover block border-b-[3px] border-(--color-ink)" />
          <div className="p-10 max-sm:p-5">
            <h1 className="font-display font-bold uppercase text-(--color-text) m-0 mb-5 leading-[0.95]" style={{ fontSize: 'clamp(34px, 6vw, 72px)' }}>
              {work.title}
            </h1>
            <div className="flex items-center gap-2.5 mb-8 flex-wrap">
              {work.year && <span className="nb-chip bg-(--color-yellow) text-(--color-on-accent)">{work.year}</span>}
              {work.genre && <span className="nb-chip">{work.genre}</span>}
              {work.tags?.map((tag) => (
                <span key={tag} className="nb-chip">
                  {techIcons[tag]}
                  {tag}
                </span>
              ))}
            </div>
            <p className="m-0 mb-10 text-(--color-text)" style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.85 }}>
              {work.longDesc}
            </p>
            {work.features?.length > 0 && (
              <div className="nb-dialog p-7 max-sm:p-5">
                <h2 className="nb-eyebrow text-(--color-text) m-0 mb-6">Key Features</h2>
                <ul className="list-none p-0 m-0 flex flex-col gap-4">
                  {work.features.map((f) => (
                    <li key={f} className="flex gap-3 text-(--color-text)" style={{ fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.6 }}>
                      <span className="font-pixel text-[10px] text-(--color-red) pt-1.5 shrink-0" aria-hidden="true">▶</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
