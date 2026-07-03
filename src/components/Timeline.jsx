import { useState, useCallback } from 'react'
import { useInView } from '../hooks/useInView'
import { educationData, experienceData, leadershipData } from '../constants/timelineData'

const TAB_DATA = { education: educationData, experience: experienceData, leadership: leadershipData }
const TABS = ['education', 'experience', 'leadership']
const TAB_LABELS = { education: 'Education', experience: 'Experience', leadership: 'Leadership' }

export default function Timeline({ timelineTab, onTabChange }) {
  const visible = useInView('timeline')
  const entries = TAB_DATA[timelineTab]
  const count = entries.length
  const [stepIndex, setStepIndex] = useState(0)

  const handleTabChange = useCallback((tab) => {
    onTabChange(tab)
    setStepIndex(0)
  }, [onTabChange])

  const reveal = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
    }`

  return (
    <section id="timeline" className="w-full min-h-screen flex items-center justify-center py-30 lg:py-20 sm:py-15 sm:min-h-auto box-border overflow-hidden">
      <div className="container text-left">
        <h2 className={`font-heading font-black text-(--color-text-h) uppercase leading-[0.88] tracking-[-0.02em] m-0 mt-10 mb-6 lg:mb-9 sm:mb-1 ${reveal()}`}
          style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}>
          My <em className="text-(--color-accent) not-italic">Journey</em>
        </h2>
        <p className={`text-(--color-text) max-w-[620px] m-0 mb-12 sm:mb-8 ${reveal('0.1s')}`}
          style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: '1.75' }}>
          Education, experience, and leadership.
        </p>
        <div className={`flex justify-center gap-3 mb-12 ${reveal('0.2s')}`}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`font-sans text-sm font-medium tracking-[0.03em] px-7 py-2.5 rounded-[10px] border cursor-pointer transition-all duration-250 sm:px-5 sm:py-2 sm:text-[13px] ${
                timelineTab === tab
                  ? 'bg-(--color-accent) text-white border-(--color-accent)'
                  : 'bg-(--color-social-bg) text-(--color-text) border-(--color-border) hover:text-(--color-accent) hover:border-(--color-accent)'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className={`relative ${reveal('0.3s')}`}>
          <div className="relative flex items-center justify-center py-8">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-(--color-border)" />
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[10px]">
              <div
                className="flex transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ transform: `translateX(-${stepIndex * 100}%)` }}
              >
                {entries.map((entry, i) => (
                  <div key={i} className="min-w-0 w-full shrink-0 grow-0 p-5 bg-(--color-code-bg) rounded-[10px] border border-(--color-border) box-border sm:p-4">
                    <span className="inline-block text-(--color-accent) bg-(--color-accent-bg) px-2.5 py-0.5 rounded-full mb-2 font-semibold sm:text-[10px] sm:px-2 sm:py-0.5 sm:mb-1.5"
                      style={{ fontSize: 'clamp(10px, 0.9vw, 12px)' }}>
                      {entry.date}
                    </span>
                    <h3 className="font-heading font-medium text-(--color-text-h) uppercase tracking-[0.04em] m-0 mb-1"
                      style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
                      {entry.title}
                    </h3>
                    <p className="m-0 text-(--color-text)" style={{ fontSize: 'clamp(12px, 1vw, 14px)', lineHeight: '1.5' }}>
                      {entry.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-4">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-full font-bold text-sm border cursor-pointer transition-all duration-300 hover:scale-110 ${
                  i === stepIndex
                    ? 'bg-(--color-accent) text-white border-(--color-accent) scale-110'
                    : 'bg-(--color-social-bg) text-(--color-text) border-(--color-border)'
                }`}
                onClick={() => setStepIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}