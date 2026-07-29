import { useInView } from '../hooks/useInView'
import { programmingWorks, musicWorks } from '../constants/worksData'
import aboutMe from '../assets/AboutMe.jpg'
import Icon from './Icon'

const gradientText = {
  background: 'linear-gradient(135deg, oklch(0.400 0.164 29.234 / 0.3) 0%, oklch(0.503 0.202 20.716 / 0.7) 25%, oklch(0.881 0.063 18.416 / 0.85) 50%, oklch(0.503 0.202 20.716 / 0.7) 75%, oklch(0.400 0.164 29.234 / 0.3) 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

export default function About() {
  const visible = useInView('about')

  const reveal = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
    }`

  const revealStats = (delay = '0.3s') =>
    `transition-all duration-600 [transition-delay:${delay}] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
    }`

  return (
    <section id="about" className="w-full min-h-screen flex items-center justify-center py-30 lg:py-20 sm:py-15 sm:min-h-auto box-border">
      <div className="container flex gap-15 items-start justify-between">
        <div className="flex-1 max-w-[480px]">
          <h2 className={`font-heading font-black text-(--color-text-h) uppercase leading-[0.88] tracking-[-0.02em] m-0 mb-4 lg:mb-9 sm:mb-1 ${reveal()}`}
            style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}>
            <span style={{ fontSize: 'clamp(28px, 4vw, 60px)' }}>Hi, I'm</span><br />
            <em className="not-italic animate-glass-shimmer" style={gradientText}>Mico Nakase</em>
          </h2>
          <div className={`flex gap-3 mb-4 ${reveal()}`}>
              <a className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg text-[11px] font-medium tracking-[0.14em] uppercase no-underline whitespace-nowrap bg-(--color-accent) text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-accent-sm" href="/Nakase_Mico_CV.pdf" target="_blank" download>
              <Icon name="arrowDown" size={12} />
              Download CV
            </a>
            <a className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg text-[11px] font-medium tracking-[0.14em] uppercase no-underline whitespace-nowrap bg-transparent border-[1.5px] border-(--color-accent) text-(--color-accent) cursor-pointer transition-all duration-300 hover:bg-(--color-accent) hover:text-white hover:shadow-accent-sm" href="#works">
              <Icon name="folder" size={12} />
              View My Work
            </a>
          </div>
          <div className={`max-w-[480px] flex flex-col gap-4 ${reveal()}`}
            style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: '1.75', color: 'var(--color-text)' }}>
            <p className="m-0">
              I'm a Full Stack & Generative AI Developer and music producer who enjoys building
              things that look good and work well. I like writing clean code just as much as I like
              producing beats — always learning, always creating.
            </p>
            <p className="m-0">
              Currently a Full Stack & Generative AI Developer Intern at{' '}
              <strong className="text-(--color-accent) font-semibold">Prosperna Philippines</strong> and the Producer &amp; External Vice President
              at <strong className="text-(--color-accent) font-semibold">Truchorus Performance Company</strong>.
            </p>
          </div>
          <div className={`flex gap-14 flex-wrap ${revealStats()}`}>
            <div>
              <span className="font-heading font-black text-(--color-accent) block leading-none mb-2"
                style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}>{programmingWorks.length}</span>
              <p className="text-[12px] tracking-[0.15em] uppercase text-(--color-text) m-0">Projects Built</p>
            </div>
            <div>
              <span className="font-heading font-black text-(--color-accent) block leading-none mb-2"
                style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}>{musicWorks.length}</span>
              <p className="text-[12px] tracking-[0.15em] uppercase text-(--color-text) m-0">Music Produced</p>
            </div>
          </div>
        </div>
        <div className={`w-[420px] md:w-[320px] shrink mt-15 ${reveal('0.15s')}`}>
          <div className="sticky top-30 lg:static">
            <img
              className={`w-full h-[500px] lg:h-[400px] sm:h-[320px] rounded-[16px] object-cover block will-change-transform transition-all duration-600 hover:scale-[1.02] hover:rotate-1 hover:shadow-accent-lg hover:brightness-105 hover:animate-none ${
                visible ? 'animate-portrait-float' : ''
              }`}
              src={aboutMe}
              alt="Mico Nakase"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
