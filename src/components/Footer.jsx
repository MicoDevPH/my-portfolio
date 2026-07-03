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
    <footer className="w-full border-t border-(--color-border) py-8 lg:py-6 sm:py-5 box-border">
      <div className="container flex flex-col items-center gap-5">
        <span className="font-serif font-semibold text-2xl text-(--color-accent) tracking-[0.06em] leading-none">
          MLN.
        </span>
        <div className="flex items-center gap-2 text-sm text-(--color-text) opacity-60">
          <span>San Pedro, Laguna</span>
          <span className="opacity-40">&middot;</span>
          <span className="flex items-center gap-1.5 opacity-100 font-medium text-xs text-(--color-green)">
            <span className="w-[7px] h-[7px] rounded-full bg-(--color-green) shrink-0" />
            Open to work
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="group flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-(--color-border) text-(--color-text) transition-all duration-250 hover:text-(--color-accent) hover:border-(--color-accent) hover:bg-(--color-accent-bg)"
            >
              <Icon name={link.icon} size={18} className="transition-transform duration-500 group-hover:animate-spin" />
            </a>
          ))}
        </div>
        <p className="text-sm text-(--color-text) opacity-60 m-0 sm:text-xs">
          &copy; {new Date().getFullYear()} Mico Nakase. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
