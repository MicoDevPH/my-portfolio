import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { revealClass } from '../lib/utils'
import { useForm } from '../hooks/useForm'
import { useTypewriter } from '../hooks/useTypewriter'
import SectionHeading from './SectionHeading'
import Icon from './Icon'

const SAMPLE_MESSAGES = [
  "Hey! I'd love to work with you...",
  'I have an exciting project in mind!',
  'Just wanted to say hi! Love your work.',
  "Let's collaborate on something awesome!",
  'Your portfolio is amazing! Quick question...',
]

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/MicoDevPH', icon: 'github', detail: 'Repositories & contributions' },
  { name: 'Facebook', href: 'https://www.facebook.com/mics12345', icon: 'facebook', detail: 'Updates & posts' },
  { name: 'Instagram', href: 'https://www.instagram.com/itsmicssss_/', icon: 'instagram', detail: 'Photos & stories' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@micodevph', icon: 'tiktok', detail: 'Short videos & clips' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mico-nakase-0835b1391/',
    icon: 'linkedin',
    detail: 'Connect professionally',
  },
  { name: 'Email', href: 'mailto:miconakaseyt@gmail.com', icon: 'mail', detail: 'Message me directly' },
]

export default function Contact() {
  const visible = useInView('contact')
  const { formData, formStatus, handleChange, handleSubmit } = useForm()

  const [messageFocused, setMessageFocused] = useState(false)
  const showTypewriter = !messageFocused && !formData.message
  const typewriterText = useTypewriter(SAMPLE_MESSAGES, !showTypewriter)

  const reveal = (delay) => revealClass(visible, delay)

  return (
    <section id="contact" className="w-full py-20 lg:py-30 box-border">
      <div className="container text-left">
        <SectionHeading
          className={reveal()}
          visible={visible}
          number={5}
          eyebrow="Contact"
          title="Get In"
          accent="Touch"
          description="Have a project in mind or just want to say hi? Drop me a message!"
        />
        <div className="flex flex-col lg:flex-row gap-14 items-start mt-14">
          <form className={`flex-1 w-full min-w-0 nb-box shadow-brutal-lg p-7 max-sm:p-5 ${reveal('0.15s', 'left')}`} onSubmit={handleSubmit}>
            <p className="nb-eyebrow m-0 mb-6 text-(--color-text)">▶ New Message</p>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <input className="nb-input" type="text" name="name" placeholder="Your Name" aria-label="Your name" value={formData.name} onChange={handleChange} required />
              <input className="nb-input" type="email" name="email" placeholder="Your Email" aria-label="Your email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-5">
              <input className="nb-input" type="text" name="subject" placeholder="Subject" aria-label="Subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="mb-6">
              <textarea
                className={`nb-input resize-y min-h-[140px] leading-[1.6] ${showTypewriter ? 'text-(--color-muted)' : ''}`}
                name="message"
                rows="5"
                aria-label="Message"
                value={showTypewriter ? typewriterText : formData.message}
                onChange={handleChange}
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
                required
              />
            </div>
            <button className="nb-btn nb-btn-yellow nb-press" type="submit" disabled={formStatus === 'sending'}>
              <Icon name="send" size={14} />
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {(formStatus === 'success' || formStatus === 'error') && (
              <p
                className={`mt-5 mb-0 inline-block font-pixel text-[10px] leading-[1.8] px-3 py-2 border-[3px] border-(--color-ink) text-white ${
                  formStatus === 'success' ? 'bg-(--color-green)' : 'bg-(--color-red)'
                }`}
              >
                {formStatus === 'success' ? 'Message sent! It was super effective!' : 'It failed! Please try again.'}
              </p>
            )}
          </form>

          <div className={`flex-1 w-full ${reveal('0.3s', 'right')}`}>
            <p className="nb-eyebrow m-0 mb-6 text-(--color-text)">Connect With Me</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-4 py-3.5 nb-box text-(--color-text) no-underline nb-press hover:bg-(--color-yellow) hover:text-(--color-on-accent)"
                >
                  <span className="flex items-center justify-center w-10 h-10 border-2 border-(--color-ink) bg-(--color-sunken) shrink-0 group-hover:bg-white group-hover:text-black group-hover:border-black">
                    <Icon name={link.icon} size={18} />
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-bold text-[15px]">{link.name}</span>
                    <span className="text-[12px] opacity-75 truncate">{link.detail}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
