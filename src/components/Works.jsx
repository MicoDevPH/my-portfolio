import { useRef, useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { revealClass } from '../lib/utils'
import { techIcons } from '../constants/techIcons'
import { programmingWorks, musicWorks } from '../constants/worksData'
import Icon from './Icon'
import TabButton from './TabButton'
import SectionHeading from './SectionHeading'

const rangeClass =
  'h-1.5 appearance-none bg-white/25 cursor-pointer min-w-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-(--color-yellow) [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-(--color-yellow) [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black'

const arrowClass =
  'flex items-center justify-center w-12 h-12 max-sm:w-9 max-sm:h-9 border-[3px] border-(--color-ink) bg-(--color-surface) text-(--color-text) shadow-brutal cursor-pointer shrink-0 z-3 nb-press'

export default function Works({ worksTab, onTabChange, carouselIndex, onPrev, onNext, onSelectWork }) {
  const visible = useInView('works')
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onLoadedMetadata = () => { setDuration(el.duration); setCurrentTime(0) }
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0) }
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (worksTab === 'music' && visible) {
      const centerWork = musicWorks[carouselIndex]
      if (centerWork?.audio) { el.src = centerWork.audio; el.play().catch(() => {}) }
    } else { el.pause() }
  }, [worksTab, carouselIndex, visible])

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) el.pause()
    else el.play().catch(() => {})
  }

  const handleSeek = (e) => {
    const el = audioRef.current
    if (!el) return
    const time = parseFloat(e.target.value)
    el.currentTime = time
    setCurrentTime(time)
  }

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }

  const prevSlide = (n) => onPrev((i) => (i - 1 + n) % n)
  const nextSlide = (n) => onNext((i) => (i + 1) % n)

  const reveal = (delay) => revealClass(visible, delay)

  function renderCarousel(works, isMusic) {
    return (
      <div className="relative flex items-center justify-center mt-10 gap-4 max-sm:gap-2">
        <button className={arrowClass} onClick={() => prevSlide(works.length)} aria-label="Previous">
          <Icon name="chevronLeft" size={22} />
        </button>
        <div className={`cq-container relative w-full ${isMusic ? 'max-w-[480px] aspect-square' : 'max-w-[880px] aspect-video'} max-sm:max-w-[78vw]`}>
          {works.map((work, index) => {
            const offset = (index - carouselIndex + works.length) % works.length
            let position = 'center'
            if (works.length > 1) {
              if (isMusic) {
                const half = Math.floor(works.length / 2)
                if (offset === 0) position = 'center'
                else if (offset <= half) position = offset === 1 ? 'right' : 'farRight'
                else position = offset === works.length - 1 ? 'farLeft' : 'left'
              } else {
                if (offset === 0) position = 'center'
                else if (offset <= Math.floor(works.length / 2)) position = 'right'
                else position = 'left'
              }
            }
            const isCenter = position === 'center'
            const posClasses = {
              center: 'translate-x-0 scale-100 opacity-100 z-2 cursor-pointer',
              right: 'translate-x-[62%] scale-[0.78] opacity-60 z-1 grayscale',
              left: '-translate-x-[62%] scale-[0.78] opacity-60 z-1 grayscale',
              farRight: 'translate-x-[120%] scale-[0.62] opacity-0 z-0 grayscale',
              farLeft: '-translate-x-[120%] scale-[0.62] opacity-0 z-0 grayscale',
            }[position]

            return (
              <div
                key={work.title}
                className={`absolute inset-0 border-[3px] border-(--color-ink) bg-(--color-surface) overflow-hidden transition-all duration-400 ${
                  isCenter ? 'shadow-brutal-lg' : 'shadow-brutal pointer-events-none'
                } ${posClasses}`}
                onClick={isCenter && !isMusic ? () => onSelectWork(work) : undefined}
              >
                <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-1" />
                <div className={`absolute left-5 right-5 z-2 text-left ${isMusic ? 'bottom-14' : 'bottom-5'} max-sm:left-3 max-sm:right-3 max-sm:bottom-3`}>
                  <span className="font-display font-bold uppercase text-white block leading-[1.1]" style={{ fontSize: 'clamp(16px, 2.4vw, 32px)' }}>
                    {work.title}
                  </span>
                  <span className="text-white/80 mt-1 line-clamp-1 max-sm:hidden" style={{ fontSize: 'clamp(12px, 1vw, 15px)' }}>
                    {work.desc}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-3 max-sm:mt-1.5">
                    {work.genre && <span className="nb-chip bg-(--color-yellow) text-black border-black">{work.genre}</span>}
                    {work.year && <span className="nb-chip bg-white text-black border-black">{work.year}</span>}
                    {work.tags?.map((tag) => (
                      <span key={tag} className="nb-chip bg-white text-black border-black">
                        {techIcons[tag]}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {isCenter && !isMusic && (
                  <span className="absolute top-3 right-3 z-2 nb-chip bg-(--color-yellow) text-black border-black max-sm:hidden">
                    View ▶
                  </span>
                )}
                {isCenter && isMusic && (
                  <div className="absolute bottom-0 inset-x-0 z-3 flex items-center gap-2 px-3 py-2 bg-black border-t-[3px] border-black">
                    <button
                      className="flex items-center justify-center w-7 h-7 bg-(--color-yellow) text-black border-2 border-white cursor-pointer shrink-0"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      <Icon name={isPlaying ? 'pause' : 'play'} size={12} />
                    </button>
                    <input type="range" min={0} max={duration || 0} step={0.1} value={currentTime} className={`flex-1 ${rangeClass}`} onChange={handleSeek} aria-label="Seek" />
                    <span className="text-white/80 text-[9px] font-pixel whitespace-nowrap shrink-0 max-sm:hidden">
                      {formatTime(currentTime)}/{formatTime(duration)}
                    </span>
                    <span className="text-white shrink-0"><Icon name="volume" size={14} /></span>
                    <input type="range" min={0} max={1} step={0.01} value={volume} className={`w-[56px] shrink-0 max-sm:w-9 ${rangeClass}`} onChange={handleVolume} aria-label="Volume" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button className={arrowClass} onClick={() => nextSlide(works.length)} aria-label="Next">
          <Icon name="chevronRight" size={22} />
        </button>
      </div>
    )
  }

  return (
    <section id="works" className="w-full min-h-screen flex items-center py-20 lg:py-30 box-border overflow-hidden bg-(--color-sunken) border-y-[3px] border-(--color-ink)">
      <div className="container text-left">
        <SectionHeading
          className={reveal()}
          visible={visible}
          number={2}
          eyebrow="Works"
          title="My"
          accent="Works"
          description="From building apps to producing beats — here's what I've been working on."
        />
        <div className={`flex justify-center gap-4 mt-12 ${reveal('0.15s', 'pop')}`}>
          {['programming', 'music'].map((tab) => (
            <TabButton key={tab} active={worksTab === tab} onClick={() => onTabChange(tab)}>
              {tab === 'programming' ? 'Programming' : 'Music'}
            </TabButton>
          ))}
        </div>
        <div className={reveal('0.25s', 'right')}>
          {worksTab === 'programming' && renderCarousel(programmingWorks, false)}
          {worksTab === 'music' && renderCarousel(musicWorks, true)}
        </div>
        <p className="nb-eyebrow text-center mt-10 m-0">
          {String(carouselIndex + 1).padStart(2, '0')} / {String((worksTab === 'music' ? musicWorks : programmingWorks).length).padStart(2, '0')}
        </p>
        <audio ref={audioRef} preload="none" />
      </div>
    </section>
  )
}
