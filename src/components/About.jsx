import { useInView } from '../hooks/useInView'
import { revealClass } from '../lib/utils'
import { programmingWorks, musicWorks } from '../constants/worksData'
import Icon from './Icon'
import PokeCard from './PokeCard'

// First line of code: BSIT, Aug 2022
const CODING_SINCE = new Date(2022, 7, 1)
const yearsCoding = () => Math.floor((Date.now() - CODING_SINCE) / (365.25 * 24 * 60 * 60 * 1000))

export default function About() {
  const visible = useInView('about')

  const reveal = (delay) => revealClass(visible, delay)

  const stats = [
    { value: programmingWorks.length, label: 'Projects Built' },
    { value: musicWorks.length, label: 'Tracks Produced' },
    { value: yearsCoding(), label: 'Years Coding' },
  ]

  return (
    <section id="about" className="w-full min-h-screen flex items-center py-20 lg:py-30 box-border">
      <div className="container flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-between">
        <div className="flex-1 max-w-[620px]">
          <p className={`nb-eyebrow m-0 mb-4 ${reveal()}`}>
            <span className="text-(--color-red)">No.001</span> · About
          </p>
          <h2
            className={`font-display font-bold uppercase text-(--color-text) leading-[0.95] m-0 mb-8 ${reveal()}`}
            style={{ fontSize: 'clamp(40px, 6.5vw, 92px)' }}
          >
            <span className="block" style={{ fontSize: '0.55em' }}>Hi, I'm</span>
            <span className="inline-block mt-3 bg-(--color-yellow) text-(--color-on-accent) border-[3px] border-(--color-ink) shadow-brutal-lg px-4 -rotate-1">
              Mico Nakase
            </span>
          </h2>

          <div
            className={`flex flex-col gap-4 text-(--color-text) mb-10 ${reveal('0.1s')}`}
            style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: 1.75 }}
          >
            <p className="m-0">
              I'm a Full Stack & Generative AI Developer and music producer who enjoys building things
              that look good and work well. I like writing clean code just as much as I like producing
              beats — always learning, always creating.
            </p>
            <p className="m-0">
              Currently a Junior AI Engineer at{' '}
              <strong className="font-bold underline decoration-(--color-yellow) decoration-4 underline-offset-4">
                Prosperna Philippines
              </strong>{' '}
              and the Producer &amp; External Vice President at{' '}
              <strong className="font-bold underline decoration-(--color-yellow) decoration-4 underline-offset-4">
                Truchorus Performance Company
              </strong>
              .
            </p>
          </div>

          <div className={`flex flex-wrap gap-4 mb-12 ${reveal('0.15s', 'pop')}`}>
            <a className="nb-btn nb-btn-yellow nb-press" href="/Nakase_Mico_CV.pdf" target="_blank" download>
              <Icon name="arrowDown" size={14} />
              Download CV
            </a>
            <a className="nb-btn nb-press" href="#works">
              <Icon name="folder" size={14} />
              View Works
            </a>
          </div>

          <div className={`grid grid-cols-3 gap-3 sm:gap-4 max-w-[560px] ${reveal('0.2s')}`}>
            {stats.map((s) => (
              <div key={s.label} className="nb-box px-4 sm:px-5 py-4">
                <span className="font-pixel text-(--color-text) block leading-none mb-3" style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}>
                  {String(s.value).padStart(2, '0')}
                </span>
                <span className="nb-eyebrow text-[8px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pokémon TCG-style card: tilt for holo shine, click to flip */}
        <div
          className={`w-full max-w-[400px] shrink-0 transition-[opacity,transform] duration-700 delay-150 ease-out ${
            visible ? 'opacity-100 [transform:perspective(1200px)_rotateY(0deg)]' : 'opacity-0 [transform:perspective(1200px)_rotateY(-80deg)]'
          }`}
        >
          <div className="lg:sticky lg:top-32">
            <PokeCard />
            <p className="nb-eyebrow text-[8px] text-center mt-6 m-0">Hover to tilt · Click to flip</p>
          </div>
        </div>
      </div>
    </section>
  )
}
