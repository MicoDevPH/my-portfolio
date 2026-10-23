import Icon from './Icon'

const NAV_ITEMS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['works', 'Works'],
  ['timeline', 'Journey'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
]

export default function Navbar({ menuOpen, onToggleMenu, theme, onToggleTheme, activeSection, onOpenTerminal }) {
  const handleNav = (id) => {
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const isActive = (id) => activeSection === id || (id === 'home' && activeSection === 'hero')

  return (
    <>
      <nav
        id="navbar"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-100 container flex items-center justify-between gap-4 py-3 nb-box"
      >
        <a
          href="/"
          className="flex items-center gap-2.5 font-pixel text-[15px] text-(--color-text) no-underline leading-none shrink-0"
          onClick={(e) => {
            e.preventDefault()
            handleNav('home')
          }}
        >
          <span className="pokeball text-[22px]" aria-hidden="true" />
          MLN.
        </a>

        <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block font-sans text-[15px] font-semibold px-3.5 py-1.5 border-2 no-underline whitespace-nowrap transition-colors duration-150 ${
                  isActive(id)
                    ? 'bg-(--color-yellow) text-(--color-on-accent) border-(--color-ink)'
                    : 'text-(--color-text) border-transparent hover:border-(--color-ink)'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(id)
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center justify-center w-10 h-10 border-[3px] border-(--color-ink) bg-(--color-surface) text-(--color-text) shadow-brutal-sm cursor-pointer nb-press font-pixel text-[10px]"
            onClick={onOpenTerminal}
            aria-label="Open terminal"
            title="Terminal (~ or Ctrl+K)"
          >
            &gt;_
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 border-[3px] border-(--color-ink) bg-(--color-surface) text-(--color-text) shadow-brutal-sm cursor-pointer nb-press"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <button
            className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 px-2 border-[3px] border-(--color-ink) bg-(--color-yellow) shadow-brutal-sm cursor-pointer nb-press"
            onClick={onToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-full h-[3px] bg-(--color-on-accent) transition-[transform,opacity] duration-200"
                style={{
                  transform: menuOpen
                    ? i === 0
                      ? 'translateY(8px) rotate(45deg)'
                      : i === 2
                        ? 'translateY(-8px) rotate(-45deg)'
                        : undefined
                    : undefined,
                  opacity: menuOpen && i === 1 ? 0 : undefined,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-99 bg-(--color-bg)/90 flex items-center justify-center px-4 animate-menu-fade"
          onClick={onToggleMenu}
        >
          {/* Battle-menu style picker */}
          <ul className="nb-dialog list-none m-0 p-8 grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-[460px]">
            {NAV_ITEMS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="group flex items-center gap-3 font-pixel text-[13px] uppercase text-(--color-text) no-underline"
                  onClick={(e) => {
                    e.preventDefault()
                    onToggleMenu()
                    handleNav(id)
                  }}
                >
                  <span
                    className={`w-3 ${isActive(id) ? 'opacity-100 animate-blink' : 'opacity-0 group-hover:opacity-100'}`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
