import Icon from './Icon'

const NAV_ITEMS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['works', 'Works'],
  ['timeline', 'Timeline'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
]

const spanBase = {
  display: 'block',
  width: '100%',
  height: '2px',
  background: 'var(--color-text)',
  borderRadius: '2px',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
}

export default function Navbar({
  menuOpen,
  onToggleMenu,
  theme,
  onToggleTheme,
  activeSection,
}) {
  const handleNav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav id="navbar" className="fixed top-5 left-1/2 -translate-x-1/2 z-100 container flex items-center justify-between py-3.5 bg-(--color-nav-bg) backdrop-blur-xl border border-(--color-nav-border) rounded-[10px] box-border">
        <a
          href="/"
          className="font-serif font-semibold text-3xl text-(--color-accent) tracking-[0.06em] no-underline leading-none shrink-0"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          MLN.
        </a>
        <ul className="hidden sm:flex items-center gap-0.5 list-none m-0 p-0 flex-wrap justify-end">
          {NAV_ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href="/"
                data-section={id}
                className={`text-[15px] font-medium tracking-[0.03em] px-3.5 py-1.5 rounded-[10px] no-underline whitespace-nowrap transition-[color,background] duration-200 ${
                  activeSection === id
                    ? 'text-(--color-accent) bg-(--color-accent-bg)'
                    : 'text-(--color-text) hover:text-(--color-accent) hover:bg-(--color-accent-bg)'
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
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="flex items-center justify-center w-[34px] h-[34px] rounded-[10px] border-none bg-transparent text-(--color-text) cursor-pointer shrink-0 transition-[color,background] duration-200 hover:text-(--color-accent) hover:bg-(--color-accent-bg)"
            onClick={onToggleTheme}
            aria-label={theme === 'japanese' ? 'Switch to Filipino theme' : 'Switch to Japanese theme'}
          >
            {theme === 'japanese' ? <Icon name="phFlag" size={18} /> : <Icon name="hinomaru" size={18} />}
          </button>
          <button
            className="sm:hidden flex flex-col justify-center gap-[5px] w-[34px] h-[34px] border-none bg-transparent cursor-pointer p-1.5"
            onClick={onToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              style={{
                ...spanBase,
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : undefined,
              }}
            />
            <span style={{ ...spanBase, opacity: menuOpen ? 0 : undefined }} />
            <span
              style={{
                ...spanBase,
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : undefined,
              }}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-99 bg-(--color-menu-overlay) backdrop-blur-xl flex items-center justify-center animate-menu-fade"
          onClick={onToggleMenu}
        >
          <ul className="list-none p-0 m-0 flex flex-col items-center gap-2">
            {NAV_ITEMS.map(([id, label]) => (
              <li key={id}>
                <a
                  href="/"
                  data-section={id}
                  className={`text-4xl font-heading font-black uppercase no-underline px-6 py-2 rounded-xl transition-colors duration-200 ${
                    activeSection === id
                      ? 'text-(--color-accent)'
                      : 'text-(--color-text) hover:text-(--color-accent)'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    onToggleMenu()
                    handleNav(id)
                  }}
                >
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
