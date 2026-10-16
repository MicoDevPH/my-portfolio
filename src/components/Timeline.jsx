import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { revealClass, staggerStyle } from '../lib/utils'
import { journeyData } from '../constants/timelineData'
import TabButton from './TabButton'
import SectionHeading from './SectionHeading'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work' },
  { id: 'edu', label: 'Education' },
  { id: 'lead', label: 'Leadership' },
]

// Pokémon type-badge style tags
const TYPES = {
  work: { label: 'Work', badge: 'bg-(--color-blue) text-white', node: 'bg-(--color-blue)' },
  edu: { label: 'Edu', badge: 'bg-(--color-yellow) text-(--color-on-accent)', node: 'bg-(--color-yellow)' },
  lead: { label: 'Lead', badge: 'bg-(--color-red) text-white', node: 'bg-(--color-red)' },
}

// The current job gets the spotlight treatment
const isSpotlight = (entry) => entry.type === 'work' && entry.current

export default function Timeline() {
  const visible = useInView('timeline', 0.05)
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = journeyData.filter((e) => filter === 'all' || e.type === filter)
  const hiddenCount = filtered.filter((e) => e.minor).length
  const entries = showAll ? filtered : filtered.filter((e) => !e.minor)

  return (
    <section id="timeline" className="w-full min-h-screen py-20 lg:py-30 box-border overflow-hidden">
      <div className="container text-left">
        <SectionHeading
          className={revealClass(visible)}
          visible={visible}
          number={3}
          eyebrow="Journey"
          title="My"
          accent="Journey"
          description="Work, education, and leadership — every badge earned along the way."
        />

        <div className={`flex flex-wrap gap-3 mt-12 ${revealClass(visible, '0.15s', 'pop')}`}>
          {FILTERS.map((f) => (
            <TabButton key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </TabButton>
          ))}
        </div>

        {/* Route map: a dashed path with cards zig-zagging left/right of it on desktop,
            and a single column (year · node · card) on smaller screens */}
        <ol className="relative list-none m-0 mt-12 p-0 max-w-[1100px] mx-auto">
          <div
            className="absolute top-2 bottom-2 left-[67px] sm:left-[95px] md:left-1/2 md:-translate-x-1/2 border-l-[3px] border-dashed border-(--color-ink) opacity-50"
            aria-hidden="true"
          />
          {entries.map((entry, i) => {
            const type = TYPES[entry.type]
            const spotlight = isSpotlight(entry)
            const cardLeft = i % 2 === 0 // desktop only: even entries sit left of the path
            return (
              <li
                key={`${entry.type}-${entry.title}-${entry.date}`}
                className={`relative grid items-start grid-cols-[44px_18px_1fr] gap-x-4 sm:grid-cols-[64px_18px_1fr] sm:gap-x-6 md:grid-cols-[1fr_24px_1fr] md:gap-x-8 mb-6 md:mb-4 last:mb-0 ${revealClass(
                  visible,
                  '0s',
                  cardLeft ? 'left' : 'right',
                )}`}
                style={staggerStyle(i, 60, 700)}
              >
                <span
                  className={`pt-5 text-right font-pixel text-[9px] sm:text-[11px] md:text-[13px] text-(--color-muted) ${
                    cardLeft ? 'md:col-start-3 md:row-start-1 md:text-left' : ''
                  }`}
                >
                  {entry.year}
                </span>

                <span
                  className={`relative z-1 mt-[18px] flex items-center justify-center ${cardLeft ? 'md:col-start-2 md:row-start-1' : ''}`}
                >
                  {spotlight ? (
                    <span className="pokeball text-[22px]" aria-hidden="true" />
                  ) : (
                    <span className={`block w-3.5 h-3.5 border-[3px] border-(--color-ink) ${type.node}`} aria-hidden="true" />
                  )}
                  {/* short connector from the node to its card (desktop zig-zag) */}
                  <span
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-[3px] bg-(--color-ink) ${
                      cardLeft ? 'right-full' : 'left-full'
                    }`}
                    aria-hidden="true"
                  />
                </span>

                <article
                  className={`min-w-0 ${cardLeft ? 'md:col-start-1 md:row-start-1' : ''} border-[3px] border-(--color-ink) px-5 py-4 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                    spotlight
                      ? 'bg-(--color-yellow) text-(--color-on-accent) shadow-brutal-lg'
                      : 'bg-(--color-surface) text-(--color-text) shadow-brutal'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`nb-chip border-(--color-ink) ${type.badge}`}>{type.label}</span>
                    {spotlight && <span className="nb-chip bg-(--color-ink) text-(--color-yellow) border-(--color-ink)">★ Now</span>}
                    <span className={`font-pixel text-[8px] uppercase ${spotlight ? '' : 'text-(--color-muted)'}`}>{entry.date}</span>
                  </div>
                  <h3
                    className="font-display font-bold uppercase m-0 leading-tight"
                    style={{ fontSize: spotlight ? 'clamp(20px, 2.4vw, 30px)' : 'clamp(17px, 1.8vw, 22px)' }}
                  >
                    {entry.title}
                  </h3>
                  <p className={`m-0 mt-1 text-[14px] sm:text-[15px] ${spotlight ? '' : 'text-(--color-muted)'}`}>
                    {entry.subtitle}
                  </p>
                </article>
              </li>
            )
          })}
        </ol>

        {hiddenCount > 0 && (
          <div className="mt-10 pl-[60px] sm:pl-[88px] md:pl-0 md:text-center">
            <button className="nb-btn nb-press" onClick={() => setShowAll((s) => !s)} aria-expanded={showAll}>
              {showAll ? '▲ Show less' : `▼ Show ${hiddenCount} older`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
