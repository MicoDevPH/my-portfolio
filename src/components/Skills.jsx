import { useInView } from '../hooks/useInView'
import { calcDuration } from '../hooks/useDuration'
import { frontendTools, backendTools, toolsAndVc } from '../constants/skillsData'

function BentoSection({ title, tools }) {
  return (
    <>
      <p className="col-span-full text-[13px] font-semibold tracking-[0.2em] uppercase text-(--color-accent) m-0 mb-3 mt-10 first:mt-0 sm:text-[11px] sm:mb-2 sm:mt-8">
        {title}
      </p>
      {tools.map((tool) => {
        const duration = calcDuration(tool.startDate)
        return (
          <div key={tool.name} className="group flex flex-col gap-3 px-4 py-3.5 rounded-xl border border-(--color-border) bg-(--color-social-bg) transition-all duration-300 hover:border-(--color-accent) hover:shadow-[0_2px_12px_var(--color-accent-bg)] hover:scale-[1.03] hover:z-10 relative sm:px-3 sm:py-2 sm:gap-2">
            <div className="flex items-center gap-3 transition-all duration-300 group-hover:gap-4 sm:gap-2">
              <img src={tool.icon} alt={tool.name} className="w-6 h-6 transition-all duration-300 group-hover:w-8 group-hover:h-8 sm:w-5 sm:h-5" />
              <span className="text-[14px] font-medium text-(--color-text-h) whitespace-nowrap transition-all duration-300 group-hover:text-[17px] sm:text-xs">{tool.name}</span>
            </div>
            <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {tool.category && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-(--color-accent) text-(--color-accent) uppercase tracking-[0.05em] transition-all duration-300 group-hover:text-[11px] sm:text-[9px]">
                      {tool.category}
                    </span>
                  )}
                  {tool.proficiency && (
                    <span className="text-[10px] font-medium text-(--color-text) opacity-70 transition-all duration-300 group-hover:text-[11px] sm:text-[9px]">
                      {tool.proficiency}
                    </span>
                  )}
                  {duration && (
                    <span className="text-[10px] font-semibold text-(--color-accent) ml-auto transition-all duration-300 group-hover:text-[11px] sm:text-[9px]">
                      {duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default function Skills() {
  const visible = useInView('skills')

  const reveal = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
    }`

  return (
    <section id="skills" className="w-full py-30 lg:py-20 sm:py-15 box-border overflow-hidden">
      <div className="container text-left">
        <h2 className={`font-heading font-black text-(--color-text-h) uppercase leading-[0.88] tracking-[-0.02em] m-0 mt-10 mb-6 ${reveal()}`}
          style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}>
          Tech <em className="text-(--color-accent) not-italic">Stack</em>
        </h2>
        <p className={`text-(--color-text) max-w-[620px] m-0 mb-14 sm:mb-8 ${reveal('0.1s')}`}
          style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: '1.75' }}>
          Tools and technologies I work with.
        </p>
        <div className={`grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 ${reveal('0.2s')}`}>
          <BentoSection title="Frontend" tools={frontendTools} />
          <BentoSection title="Backend" tools={backendTools} />
          <BentoSection title="Developer Tooling" tools={toolsAndVc} />
        </div>
      </div>
    </section>
  )
}
