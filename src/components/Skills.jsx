import { useInView } from '../hooks/useInView'
import { revealClass, staggerStyle } from '../lib/utils'
import { calcLevel, formatSince } from '../hooks/useDuration'
import { partyTools, boxGroups } from '../constants/skillsData'
import SectionHeading from './SectionHeading'

// Featured card — like a slot on the Pokémon party screen
function PartyCard({ tool }) {
  return (
    <div className="group h-full flex items-center gap-4 px-4 py-4 nb-box transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg hover:bg-(--color-yellow) hover:text-(--color-on-accent)">
      <span className="flex items-center justify-center w-14 h-14 bg-white border-[3px] border-(--color-ink) shrink-0">
        <img src={tool.icon} alt="" className="w-9 h-9" loading="lazy" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display font-bold uppercase text-[20px] leading-tight truncate">{tool.name}</span>
          <span className="font-pixel text-[10px] shrink-0">
            Lv.<span className="text-[14px]">{calcLevel(tool.startDate)}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="nb-chip text-[7px] bg-(--color-surface)">{tool.category}</span>
          <span className="font-pixel text-[7px] uppercase text-(--color-muted) group-hover:text-(--color-on-accent)">
            Since {formatSince(tool.startDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Compact chip for everything stored in the PC Box
function BoxChip({ tool }) {
  return (
    <span
      className="flex items-center gap-2 px-3 py-2 border-2 border-(--color-ink) bg-(--color-surface) text-[14px] font-semibold transition-colors duration-150 hover:bg-(--color-yellow) hover:text-(--color-on-accent)"
      title={`${tool.category} · since ${formatSince(tool.startDate)}`}
    >
      <img src={tool.icon} alt="" className="w-[18px] h-[18px]" loading="lazy" />
      {tool.name}
      <span className="font-pixel text-[7px] opacity-60">Lv.{calcLevel(tool.startDate)}</span>
    </span>
  )
}

// Stagger order for the box chips: continues after the 6 party cards
const boxRows = boxGroups
  .map((g) => ({ ...g, stored: g.tools.filter((t) => !t.party) }))
  .filter((g) => g.stored.length > 0)
let chipOrder = partyTools.length
for (const g of boxRows) g.stored = g.stored.map((t) => ({ ...t, order: chipOrder++ }))
const boxCount = boxRows.reduce((n, g) => n + g.stored.length, 0)

export default function Skills() {
  const visible = useInView('skills', 0.1)

  return (
    <section id="skills" className="w-full py-20 lg:py-30 box-border overflow-hidden bg-(--color-sunken) border-y-[3px] border-(--color-ink)">
      <div className="container text-left">
        <SectionHeading
          className={revealClass(visible)}
          visible={visible}
          number={4}
          eyebrow="Skills"
          title="Tech"
          accent="Stack"
          description="My party of six, plus everything else in the PC Box. Lv. = months I've been using it."
        />

        {/* Party: the core day-to-day stack */}
        <p className={`nb-eyebrow text-(--color-text) m-0 mt-14 mb-5 flex items-center gap-3 ${revealClass(visible, '0.1s')}`}>
          <span className="pokeball text-[14px]" aria-hidden="true" />
          Party
          <span className="flex-1 border-t-[3px] border-(--color-ink)" aria-hidden="true" />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {partyTools.map((tool, i) => (
            <div key={tool.name} className={revealClass(visible, '0s', 'pop')} style={staggerStyle(i, 70)}>
              <PartyCard tool={tool} />
            </div>
          ))}
        </div>

        {/* PC Box: everything else, compact */}
        <div className={`mt-14 border-[3px] border-(--color-ink) bg-(--color-surface) shadow-brutal ${revealClass(visible, '0.3s')}`}>
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-(--color-ink) text-(--color-bg)">
            <span className="font-pixel text-[11px] uppercase">PC Box</span>
            <span className="font-pixel text-[8px] uppercase text-(--color-yellow)">{boxCount} stored</span>
          </div>
          <div className="px-5 py-6 flex flex-col gap-6">
            {boxRows.map((group) => (
              <div key={group.title} className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                <span className="nb-eyebrow text-(--color-text) md:w-[110px] md:pt-3 shrink-0">{group.title}</span>
                <div className="flex flex-wrap gap-2.5">
                  {group.stored.map((tool) => (
                    <span key={tool.name} className={revealClass(visible, '0s', 'pop')} style={staggerStyle(tool.order, 25, 900)}>
                      <BoxChip tool={tool} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
