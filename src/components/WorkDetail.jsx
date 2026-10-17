import { useEffect, useState } from 'react'
import { techIcons } from '../constants/techIcons'
import Icon from './Icon'

const NAV_BTN =
  'flex items-center justify-center w-10 h-10 shrink-0 bg-(--color-surface) text-(--color-text) border-[3px] border-(--color-ink) shadow-brutal cursor-pointer'

function Lightbox({ shots, index, onIndex, onClose }) {
  const shot = shots[index]
  const many = shots.length > 1

  useEffect(() => {
    const step = (dir) => onIndex((index + dir + shots.length) % shots.length)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (many && e.key === 'ArrowLeft') step(-1)
      else if (many && e.key === 'ArrowRight') step(1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [index, many, shots.length, onIndex, onClose])

  const go = (dir) => onIndex((index + dir + shots.length) % shots.length)

  return (
    <div
      className="fixed inset-0 z-[1001] bg-black/75 flex items-center justify-center p-4 animate-menu-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption}
    >
      <figure className="relative m-0 w-full max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
        <button className={`${NAV_BTN} absolute -top-3 -right-3 z-1 max-sm:top-2 max-sm:right-2`} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img
          src={shot.src}
          alt={shot.caption}
          className="block w-full max-h-[calc(100vh-140px)] object-contain bg-(--color-surface) border-[3px] border-(--color-ink) shadow-brutal-lg"
        />
        <figcaption className="flex items-center gap-4 mt-4 text-white text-[15px]">
          {many && (
            <button className={NAV_BTN} onClick={() => go(-1)} aria-label="Previous screenshot">
              <Icon name="chevronLeft" size={18} />
            </button>
          )}
          <span className="flex-1 text-center">
            {shot.caption}
            {many && <span className="ml-2 opacity-60">{index + 1} / {shots.length}</span>}
          </span>
          {many && (
            <button className={NAV_BTN} onClick={() => go(1)} aria-label="Next screenshot">
              <Icon name="chevronRight" size={18} />
            </button>
          )}
        </figcaption>
      </figure>
    </div>
  )
}

export default function WorkDetail({ work, onBack }) {
  const [openShot, setOpenShot] = useState(null)

  // Switching projects closes any open preview
  useEffect(() => setOpenShot(null), [work])

  if (!work) return null

  return (
    <div className="min-h-screen halftone overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-24 max-sm:px-4">
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
              {work.role && <span className="nb-chip bg-(--color-sunken)">{work.role}</span>}
              {work.genre && <span className="nb-chip">{work.genre}</span>}
              {work.tags?.map((tag) => (
                <span key={tag} className="nb-chip">
                  {techIcons[tag]}
                  {tag}
                </span>
              ))}
            </div>
            <p className="m-0 mb-8 max-w-[820px] text-(--color-text)" style={{ fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.85 }}>
              {work.longDesc}
            </p>
            {work.outcome && (
              <p className="m-0 mb-8 max-w-[820px] text-[16px] font-semibold">
                <span className="text-(--color-green)">▲</span> {work.outcome}
              </p>
            )}
            {(work.live || work.github) && (
              <div className="flex flex-wrap gap-3 mb-10">
                {work.live && (
                  <a className="nb-btn nb-btn-yellow nb-press" href={work.live} target="_blank" rel="noopener noreferrer">
                    ⌂ Live Demo
                  </a>
                )}
                {work.github && (
                  <a className="nb-btn nb-press" href={work.github} target="_blank" rel="noopener noreferrer">
                    <Icon name="github" size={14} /> Source Code
                  </a>
                )}
              </div>
            )}
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
            {work.gallery?.length > 0 && (
              <div className="mt-10">
                <h2 className="nb-eyebrow text-(--color-text) m-0 mb-6">Screenshots</h2>
                <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                  {work.gallery.map((shot, i) => (
                    <figure key={shot.caption} className="m-0">
                      <button
                        type="button"
                        onClick={() => setOpenShot(i)}
                        aria-label={`View ${shot.caption}`}
                        className="block w-full p-0 nb-box shadow-brutal overflow-hidden cursor-pointer transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                      >
                        <img src={shot.src} alt={shot.caption} className="w-full aspect-[16/10] object-cover block" loading="lazy" />
                      </button>
                      <figcaption className="mt-3 text-[14px] text-(--color-muted)">{shot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {openShot !== null && work.gallery?.[openShot] && (
        <Lightbox shots={work.gallery} index={openShot} onIndex={setOpenShot} onClose={() => setOpenShot(null)} />
      )}
    </div>
  )
}
