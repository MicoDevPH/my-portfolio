import Icon from './Icon'

const SOCIAL_LINKS = [
  { href: 'https://github.com/MicoDevPH', icon: 'github', label: 'GitHub' },
  { href: 'https://www.facebook.com/mics12345', icon: 'facebook', label: 'Facebook' },
  { href: 'https://www.instagram.com/itsmicssss_/', icon: 'instagram', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@micodevph', icon: 'tiktok', label: 'TikTok' },
  {
    href: 'https://www.linkedin.com/in/mico-nakase-0835b1391/',
    icon: 'linkedin',
    label: 'LinkedIn',
  },
  { href: 'mailto:miconakaseyt@gmail.com', icon: 'mail', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="w-full border-t-[3px] border-(--color-ink) bg-(--color-yellow) text-(--color-on-accent) py-10 box-border">
      <div className="container flex flex-col items-center gap-6">
        <span className="flex items-center gap-3 font-pixel text-[18px] leading-none">
          <span className="pokeball text-[26px]" aria-hidden="true" />
          MLN.
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          <span>San Pedro, Laguna</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-2 bg-white text-black border-2 border-black px-2.5 py-1 font-pixel text-[8px] uppercase">
            <span className="w-2 h-2 bg-(--color-green) border border-black animate-blink" />
            Open for commissions
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex items-center justify-center w-11 h-11 border-[3px] border-black bg-white text-black shadow-[3px_3px_0_0_#111] transition-transform duration-150 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Icon name={link.icon} size={18} />
            </a>
          ))}
        </div>
        <p className="font-pixel text-[8px] leading-[1.8] uppercase m-0 text-center">
          &copy; {new Date().getFullYear()} Mico Nakase · Gotta build &apos;em all
        </p>
      </div>
    </footer>
  )
}
