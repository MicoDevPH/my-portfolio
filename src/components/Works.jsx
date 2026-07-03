import { useRef, useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { techIcons } from '../constants/techIcons'
import { programmingWorks, musicWorks } from '../constants/worksData'
import Icon from './Icon'

export default function Works({
  worksTab,
  onTabChange,
  carouselIndex,
  onPrev,
  onNext,
}) {
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

  const revealFromLeft = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[50px]'
    }`

  const revealFromRight = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50px]'
    }`

  function renderCarousel(works, isMusic) {
    return (
      <div className="relative flex items-center justify-center mt-14 lg:mt-10 sm:mt-8 gap-4 sm:gap-2">
        <button
          className="flex items-center justify-center w-11 h-11 sm:w-8 sm:h-8 rounded-full border border-(--color-border) bg-(--color-social-bg) text-(--color-text) cursor-pointer shrink-0 z-3 transition-all duration-250 hover:text-(--color-accent) hover:border-(--color-accent)"
          onClick={() => prevSlide(works.length)}
          aria-label="Previous"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className={`relative w-full ${isMusic ? 'max-w-[506px] aspect-square lg:max-w-[366px]' : 'max-w-[900px] aspect-video lg:max-w-[650px]'} sm:max-w-[85vw]`}>
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
            const posClasses = isMusic
              ? position === 'center'
                ? 'translate-x-0 scale-100 opacity-100 z-2 brightness-100 cursor-pointer'
                : position === 'right'
                  ? 'translate-x-[65%] scale-[0.78] opacity-70 z-1 brightness-40'
                  : position === 'farRight'
                    ? 'translate-x-[130%] scale-[0.65] opacity-25 z-0 brightness-30'
                    : position === 'left'
                      ? '-translate-x-[65%] scale-[0.78] opacity-70 z-1 brightness-40'
                      : '-translate-x-[130%] scale-[0.65] opacity-25 z-0 brightness-30'
              : position === 'center'
                ? 'translate-x-0 scale-100 opacity-100 z-2 brightness-100 cursor-pointer'
                : position === 'left'
                  ? '-translate-x-[65%] scale-[0.78] opacity-50 z-1 brightness-40 sm:-translate-x-[55%] sm:scale-[0.75]'
                  : 'translate-x-[65%] scale-[0.78] opacity-50 z-1 brightness-40 sm:translate-x-[55%] sm:scale-[0.75]'

            return (
              <div
                key={work.title}
                className={`absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${posClasses}`}
              >
                <img src={work.img} alt={work.title} className="w-full h-full object-cover rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-linear-to-t from-[rgba(0,0,0,0.95)] to-transparent rounded-b-xl pointer-events-none z-1" />
                <div className="absolute bottom-12 left-6 right-6 sm:bottom-[34px] sm:left-2.5 sm:right-2.5 z-2 text-left">
                  <span className="text-white font-bold block leading-[1.2] sm:text-[11px]"
                    style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>{work.title}</span>
                  <span className="text-[rgba(255,255,255,0.7)] mt-1 sm:mt-0.5 line-clamp-1 sm:text-[8px]"
                    style={{ fontSize: 'clamp(12px, 1vw, 14px)' }}>{work.desc}</span>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {work.genre && <span className="inline-flex items-center gap-1 px-3.5 py-0.5 rounded-full text-[10px] font-medium tracking-[0.03em] whitespace-nowrap bg-[rgba(255,255,255,0.15)] border-[rgba(255,255,255,0.3)] text-white">{work.genre}</span>}
                    {work.year && <span className="inline-flex items-center gap-1 px-3.5 py-0.5 rounded-full text-[10px] font-medium tracking-[0.03em] whitespace-nowrap bg-[rgba(100,200,255,0.12)] border-[rgba(100,200,255,0.25)] text-[rgba(100,200,255,0.9)]">{work.year}</span>}
                    {work.tags?.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3.5 py-0.5 rounded-full text-[10px] font-medium tracking-[0.03em] whitespace-nowrap bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.85)]">
                        {techIcons[tag]}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {position === 'center' && isMusic && (
                  <div className="absolute bottom-0 left-0 right-0 z-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-linear-to-t from-[rgba(0,0,0,0.85)] to-[rgba(0,0,0,0.3)] rounded-b-xl sm:p-1 sm:gap-1">
                    <button className="bg-none border-none text-white cursor-pointer flex items-center p-0 shrink-0" onClick={togglePlay}>
                      <Icon name={isPlaying ? 'pause' : 'play'} size={12} />
                    </button>
                    <input type="range" min={0} max={duration || 0} step={0.1} value={currentTime}
                      className="flex-1 h-1 appearance-none bg-[rgba(255,255,255,0.2)] rounded-sm cursor-pointer min-w-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--color-accent) [&::-webkit-slider-thumb]:border-none [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--color-accent) [&::-moz-range-thumb]:border-none"
                      onChange={handleSeek} />
                    <span className="text-[rgba(255,255,255,0.7)] text-[10px] font-mono whitespace-nowrap shrink-0 sm:text-[8px]">{formatTime(currentTime)}/{formatTime(duration)}</span>
                    <Icon name="volume" size={12} />
                    <input type="range" min={0} max={1} step={0.01} value={volume}
                      className="w-[50px] h-1 appearance-none bg-[rgba(255,255,255,0.2)] rounded-sm cursor-pointer shrink-0 sm:w-9 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--color-accent) [&::-webkit-slider-thumb]:border-none [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--color-accent) [&::-moz-range-thumb]:border-none"
                      onChange={handleVolume} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button
          className="flex items-center justify-center w-11 h-11 sm:w-8 sm:h-8 rounded-full border border-(--color-border) bg-(--color-social-bg) text-(--color-text) cursor-pointer shrink-0 z-3 transition-all duration-250 hover:text-(--color-accent) hover:border-(--color-accent)"
          onClick={() => nextSlide(works.length)}
          aria-label="Next"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    )
  }

  return (
    <section id="works" className="w-full min-h-screen flex items-center justify-center py-30 lg:py-20 sm:py-15 sm:min-h-auto box-border overflow-hidden">
      <div className="container text-left">
        <h2 className={`font-heading font-black text-(--color-text-h) uppercase leading-[0.88] tracking-[-0.02em] m-0 mt-10 mb-6 lg:mb-9 sm:mb-1 ${revealFromRight()}`}
          style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}>
          My <em className="text-(--color-accent) not-italic">Works</em>
        </h2>
        <p className={`text-(--color-text) m-0 mb-12 sm:mb-8 ${revealFromLeft('0.1s')}`}
          style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: '1.75' }}>
          From building apps to producing beats — here's what I've been working on.
        </p>
        <div className={`flex justify-center gap-3 mb-12 ${revealFromRight('0.2s')}`}>
          {['programming', 'music'].map((tab) => (
            <button
              key={tab}
              className={`font-sans text-sm font-medium tracking-[0.03em] px-7 py-2.5 rounded-[10px] border cursor-pointer transition-all duration-250 sm:px-5 sm:py-2 sm:text-[13px] ${
                worksTab === tab
                  ? 'bg-(--color-accent) text-white border-(--color-accent)'
                  : 'bg-(--color-social-bg) text-(--color-text) border-(--color-border) hover:text-(--color-accent) hover:border-(--color-accent)'
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab === 'programming' ? 'Programming' : 'Music'}
            </button>
          ))}
        </div>
        <div className={revealFromLeft('0.3s')}>
          {worksTab === 'programming' && renderCarousel(programmingWorks, false)}
          {worksTab === 'music' && renderCarousel(musicWorks, true)}
        </div>
        <audio ref={audioRef} preload="none" />
      </div>
    </section>
  )
}
