import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { revealClass, staggerStyle } from '../lib/utils'
import { techIcons } from '../constants/techIcons'
import Icon from './Icon'
import TabButton from './TabButton'
import SectionHeading from './SectionHeading'

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

function TechChips({ tags }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags?.map((tag) => (
        <span key={tag} className="nb-chip">
          {techIcons[tag]}
          {tag}
        </span>
      ))}
    </div>
  )
}

function ProjectLinks({ work, onDetails }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <button className="nb-btn nb-btn-yellow nb-press px-4 py-2.5 text-[9px]" onClick={onDetails}>
        ▶ Details
      </button>
      {work.live && (
        <a className="nb-btn nb-press px-4 py-2.5 text-[9px]" href={work.live} target="_blank" rel="noopener noreferrer">
          ⌂ Live
        </a>
      )}
      {work.github && (
        <a className="nb-btn nb-press px-4 py-2.5 text-[9px]" href={work.github} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={12} /> Code
        </a>
      )}
    </div>
  )
}

// Game Boy cartridge-style project card. `featured` = wide spotlight layout.
function Cartridge({ work, featured, onSelect }) {
  return (
    <article className={`h-full flex flex-col nb-box ${featured ? 'shadow-brutal-lg' : ''}`}>
      {/* cartridge ridge */}
      <div
        className="h-4 shrink-0 border-b-[3px] border-(--color-ink) bg-(--color-sunken)"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, var(--color-ink) 0 3px, transparent 3px 14px)',
          backgroundSize: '100% 50%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      <div className={`flex-1 flex flex-col ${featured ? 'lg:flex-row' : ''} gap-5 p-5`}>
        {/* label art */}
        <button
          className={`block shrink-0 self-start w-full border-[3px] border-(--color-ink) overflow-hidden bg-(--color-sunken) cursor-pointer group ${
            featured ? 'lg:w-[56%]' : ''
          }`}
          onClick={onSelect}
          aria-label={`Open ${work.title} details`}
        >
          <img
            src={work.img}
            alt=""
            className="w-full aspect-video object-cover block transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </button>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {featured && <span className="nb-chip bg-(--color-yellow) text-(--color-on-accent)">★ Featured</span>}
            <span className="nb-chip">{work.year}</span>
            {work.role && <span className="nb-chip bg-(--color-sunken)">{work.role}</span>}
          </div>
          <h3
            className="font-display font-bold uppercase m-0 leading-tight"
            style={{ fontSize: featured ? 'clamp(24px, 3vw, 38px)' : 'clamp(20px, 2vw, 26px)' }}
          >
            {work.title}
          </h3>
          <p className="m-0 text-(--color-muted) text-[15px] leading-relaxed">{featured ? work.longDesc : work.desc}</p>
          {work.outcome && (
            <p className="m-0 text-[14px] font-semibold">
              <span className="text-(--color-green)">▲</span> {work.outcome}
            </p>
          )}
          <TechChips tags={work.tags} />
          <div className="mt-auto pt-2">
            <ProjectLinks work={work} onDetails={onSelect} />
          </div>
        </div>
      </div>
    </article>
  )
}

// Little animated equalizer shown on the track that's playing
function Equalizer({ playing }) {
  return (
    <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-[3px] bg-current ${playing ? 'animate-dot-pulse' : ''}`}
          style={{ height: playing ? `${[60, 100, 75][i]}%` : '40%', animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  )
}

// Cover art, or a ♪ placeholder for tracks without artwork yet
function TrackCover({ track, className, noteSize }) {
  return track.img ? (
    <img src={track.img} alt="" className={`object-cover block ${className}`} loading="lazy" />
  ) : (
    <span className={`flex items-center justify-center bg-(--color-yellow) text-black ${noteSize} ${className}`} aria-hidden="true">
      ♪
    </span>
  )
}

function TrackCard({ track, active, playing, onPlay, onDetails }) {
  return (
    <article className="flex flex-col gap-3">
      <div className="relative">
        <button
          className={`relative block w-full aspect-square border-[3px] border-(--color-ink) overflow-hidden cursor-pointer group transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
            active ? 'shadow-brutal-lg' : 'shadow-brutal'
          }`}
          onClick={onPlay}
          aria-label={`${active && playing ? 'Pause' : 'Play'} ${track.title}`}
        >
          <TrackCover track={track} className="w-full h-full" noteSize="text-6xl" />
          {active && <span className="absolute inset-0 border-[5px] border-(--color-yellow) pointer-events-none" aria-hidden="true" />}
          {track.award && (
            <span className="absolute top-2 left-2 right-2 w-fit nb-chip bg-(--color-yellow) text-black border-black whitespace-normal text-left leading-[1.6]">
              {track.award.startsWith('1st') ? '🏆 ' : ''}
              {track.award}
            </span>
          )}
          <span className="absolute bottom-2 left-2 flex items-center justify-center w-11 h-11 bg-(--color-yellow) text-black border-[3px] border-black shadow-[3px_3px_0_0_#111] transition-transform duration-150 group-hover:scale-110">
            <Icon name={active && playing ? 'pause' : 'play'} size={16} />
          </span>
        </button>
        {/* sibling of the cover button, since buttons can't nest */}
        <button
          className="pokeball-trigger group/ball absolute bottom-2 right-2 flex items-center cursor-pointer"
          onClick={onDetails}
          aria-label={`${track.title} details`}
        >
          {/* "Details" tag slides out of the ball on hover */}
          <span
            className="max-w-0 px-0 mr-1.5 py-1.5 overflow-hidden whitespace-nowrap opacity-0 bg-white text-black font-pixel text-[8px] uppercase border-[3px] border-black shadow-[2px_2px_0_0_#111] transition-all duration-200 group-hover/ball:max-w-24 group-hover/ball:px-2 group-hover/ball:opacity-100 group-focus-visible/ball:max-w-24 group-focus-visible/ball:px-2 group-focus-visible/ball:opacity-100"
            aria-hidden="true"
          >
            Details
          </span>
          <span className="pokeball-open text-[32px] drop-shadow-[2px_2px_0_#111]" aria-hidden="true">
            <span className="pb-bottom" />
            <span className="pb-glow" />
            <span className="pb-top" />
          </span>
        </button>
      </div>
      <div>
        <h3 className="font-display font-bold uppercase m-0 text-[17px] leading-tight flex items-center gap-2">
          {track.title}
          {active && <Equalizer playing={playing} />}
        </h3>
        <p className="m-0 mt-1 font-pixel text-[8px] uppercase text-(--color-muted) leading-[1.8]">
          {track.genre} · {track.year}
        </p>
      </div>
    </article>
  )
}

// Credit roles in display order — a track only shows the ones it fills in.
// Each role gets its own color (label chip + side bar) so they read apart at a glance.
const CREDIT_ROLES = [
  ['artist', 'Artist', 'bg-(--color-yellow) text-black', 'border-(--color-yellow)'],
  ['vocals', 'Vocals', 'bg-(--color-red) text-white', 'border-(--color-red)'],
  ['lyricist', 'Lyricist', 'bg-(--color-blue) text-white', 'border-(--color-blue)'],
  ['composer', 'Composer', 'bg-(--color-green) text-black', 'border-(--color-green)'],
  ['arranger', 'Arranger', 'bg-(--color-yellow-deep) text-black', 'border-(--color-yellow-deep)'],
  ['producer', 'Producer', 'bg-(--color-ink) text-(--color-surface)', 'border-(--color-ink)'],
  ['mixing', 'Mixing & Mastering', 'bg-(--color-blue-deep) text-white', 'border-(--color-blue-deep)'],
]

// Reads a track's length from the file itself (metadata only, no full download)
function useTrackLength(src) {
  const [length, setLength] = useState(null)
  useEffect(() => {
    const probe = new Audio()
    probe.preload = 'metadata'
    probe.onloadedmetadata = () => setLength(probe.duration)
    probe.src = src
    return () => {
      probe.onloadedmetadata = null
      probe.removeAttribute('src')
    }
  }, [src])
  return length
}

// Detail popup for a track — playing from here drives the same player bar
function TrackModal({ track, active, playing, onPlay, onClose }) {
  const length = useTrackLength(track.audio)
  // skip Vocals when it just repeats the Artist
  const credits = CREDIT_ROLES.filter(
    ([key]) => track.credits?.[key] && !(key === 'vocals' && track.credits.vocals === track.credits.artist),
  )

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[1001] bg-black/60 flex items-center justify-center p-4 animate-menu-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={track.title}
    >
      <div className="relative w-full max-w-[920px] max-h-[calc(100vh-32px)] overflow-y-auto nb-box shadow-brutal-lg" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-3 right-3 z-1 flex items-center justify-center w-9 h-9 bg-(--color-surface) text-(--color-text) border-[3px] border-(--color-ink) cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="flex max-md:flex-col gap-8 p-8 max-sm:p-5 max-sm:gap-5">
          <div className="w-[320px] max-md:w-full max-md:max-w-[320px] aspect-square shrink-0 border-[3px] border-(--color-ink) shadow-brutal overflow-hidden">
            <TrackCover track={track} className="w-full h-full" noteSize="text-8xl" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <h3 className="font-display font-bold uppercase m-0 pr-10 leading-[0.95]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              {track.title}
            </h3>
            {track.credits?.artist && <p className="m-0 -mt-2 font-pixel text-[10px] uppercase text-(--color-muted)">{track.credits.artist}</p>}
            <div className="flex flex-wrap gap-2">
              <span className="nb-chip bg-(--color-yellow) text-(--color-on-accent)">{track.year}</span>
              <span className="nb-chip">{track.genre}</span>
              {length && <span className="nb-chip bg-(--color-sunken)">⏱ {formatTime(length)}</span>}
            </div>
            {track.award && (
              <p className="m-0 text-[15px] font-semibold">
                <span className="text-(--color-green)">▲</span> {track.award}
              </p>
            )}
            <p className="m-0 text-(--color-text) text-[16px] leading-[1.8]">{track.longDesc}</p>
            <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
              <button className="nb-btn nb-btn-yellow nb-press px-4 py-2.5 text-[9px]" onClick={onPlay}>
                <Icon name={active && playing ? 'pause' : 'play'} size={12} />
                {active && playing ? 'Pause' : 'Play'}
              </button>
              {track.links?.map((link) => (
                <a key={link.url} className="nb-btn nb-press px-4 py-2.5 text-[9px]" href={link.url} target="_blank" rel="noopener noreferrer">
                  ↗ {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        {credits.length > 0 && (
          <div className="mx-8 mb-8 max-sm:mx-5 max-sm:mb-5 nb-dialog p-6 max-sm:p-5">
            <h4 className="nb-eyebrow text-(--color-text) m-0 mb-5">Credits</h4>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 m-0">
              {credits.map(([key, label, chip, bar]) => (
                <div key={key} className={`min-w-0 pl-3 border-l-[4px] ${bar}`}>
                  <dt className={`w-fit px-2 py-1 font-pixel text-[8px] uppercase leading-none border-2 border-(--color-ink) ${chip}`}>{label}</dt>
                  {[track.credits[key]].flat().map((name) => (
                    <dd key={name} className="m-0 mt-1.5 first-of-type:mt-2.5 text-[15px] font-semibold text-(--color-text)">
                      {name}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}

// Game Boy–style player bar that stays on screen once something has been played
function PlayerBar({ track, playing, currentTime, duration, volume, onToggle, onSeek, onVolume, onClose }) {
  const range =
    'h-1.5 appearance-none bg-white/25 cursor-pointer min-w-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-(--color-yellow) [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-(--color-yellow) [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black'

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-90 w-[min(720px,calc(100vw-32px))] flex items-center gap-3 px-3 py-2.5 bg-[#111] text-white border-[3px] border-[#111] shadow-[6px_6px_0_0_var(--color-yellow)] animate-ganymede-slide-up">
      <TrackCover track={track} className="w-11 h-11 border-2 border-white shrink-0" noteSize="text-xl" />
      <button
        className="flex items-center justify-center w-9 h-9 shrink-0 bg-(--color-yellow) text-black border-2 border-white cursor-pointer"
        onClick={onToggle}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        <Icon name={playing ? 'pause' : 'play'} size={14} />
      </button>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-pixel text-[9px] uppercase truncate">{track.title}</span>
          <span className="font-pixel text-[8px] text-white/70 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <input type="range" min={0} max={duration || 0} step={0.1} value={currentTime} onChange={onSeek} className={`w-full ${range}`} aria-label="Seek" />
      </div>
      <span className="hidden sm:block shrink-0 text-white/80">
        <Icon name="volume" size={14} />
      </span>
      <input type="range" min={0} max={1} step={0.01} value={volume} onChange={onVolume} className={`hidden sm:block w-16 shrink-0 ${range}`} aria-label="Volume" />
      <button
        className="flex items-center justify-center w-8 h-8 shrink-0 border-2 border-white/60 text-white cursor-pointer hover:bg-white hover:text-black"
        onClick={onClose}
        aria-label="Close player"
      >
        ✕
      </button>
    </div>
  )
}

export default function Works({ projects, music, loadFailed, worksTab, onTabChange, onSelectWork }) {
  const visible = useInView('works', 0.1)
  const audioRef = useRef(null)
  const [trackIndex, setTrackIndex] = useState(null) // null = player hidden
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.6)
  const [detailIndex, setDetailIndex] = useState(null)
  const closeDetails = useCallback(() => setDetailIndex(null), [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration)
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Nothing plays until the visitor clicks a track
  const playTrack = (i) => {
    const el = audioRef.current
    if (!el) return
    if (i === trackIndex) {
      if (el.paused) el.play().catch(() => {})
      else el.pause()
      return
    }
    setTrackIndex(i)
    setCurrentTime(0)
    setDuration(0)
    el.src = music[i].audio
    el.play().catch(() => {})
  }

  const closePlayer = () => {
    audioRef.current?.pause()
    setTrackIndex(null)
  }

  const reveal = (delay) => revealClass(visible, delay)
  const ordered = [...projects.filter((w) => w.featured), ...projects.filter((w) => !w.featured)]

  return (
    <section
      id="works"
      className="w-full min-h-screen py-20 lg:py-30 box-border overflow-hidden bg-(--color-sunken) border-y-[3px] border-(--color-ink)"
    >
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

        <div className={`flex flex-wrap gap-4 mt-12 ${revealClass(visible, '0.15s', 'pop')}`}>
          <TabButton active={worksTab === 'programming'} onClick={() => onTabChange('programming')}>
            Programming
          </TabButton>
          <TabButton active={worksTab === 'music'} onClick={() => onTabChange('music')}>
            Music
          </TabButton>
        </div>

        {loadFailed && (
          <p className="nb-box mt-12 px-5 py-4 m-0 text-(--color-text) font-semibold">
            Couldn't load my works right now. Please refresh in a moment.
          </p>
        )}

        {worksTab === 'programming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-12">
            {ordered.map((work, i) => (
              <div
                key={work._id}
                className={`${work.featured ? 'md:col-span-2' : ''} ${revealClass(visible, '0s', 'up')}`}
                style={staggerStyle(i, 100)}
              >
                <Cartridge work={work} featured={work.featured} onSelect={() => onSelectWork(work)} />
              </div>
            ))}
          </div>
        )}

        {worksTab === 'music' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8 mt-12">
            {music.map((track, i) => (
              <div key={track._id} className={revealClass(visible, '0s', 'pop')} style={staggerStyle(i, 70)}>
                <TrackCard
                  track={track}
                  active={trackIndex === i}
                  playing={trackIndex === i && playing}
                  onPlay={() => playTrack(i)}
                  onDetails={() => setDetailIndex(i)}
                />
              </div>
            ))}
          </div>
        )}

        <audio ref={audioRef} preload="none" />
      </div>

      {trackIndex !== null && (
        <PlayerBar
          track={music[trackIndex]}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onToggle={() => playTrack(trackIndex)}
          onSeek={(e) => {
            const t = parseFloat(e.target.value)
            audioRef.current.currentTime = t
            setCurrentTime(t)
          }}
          onVolume={(e) => setVolume(parseFloat(e.target.value))}
          onClose={closePlayer}
        />
      )}

      {detailIndex !== null && (
        <TrackModal
          track={music[detailIndex]}
          active={trackIndex === detailIndex}
          playing={trackIndex === detailIndex && playing}
          onPlay={() => playTrack(detailIndex)}
          onClose={closeDetails}
        />
      )}
    </section>
  )
}
