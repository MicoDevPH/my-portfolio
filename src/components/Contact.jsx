import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useForm } from '../hooks/useForm'
import { useTypewriter } from '../hooks/useTypewriter'
import Icon from './Icon'

const SAMPLE_MESSAGES = [
  "Hey! I'd love to work with you...",
  'I have an exciting project in mind!',
  'Just wanted to say hi! Love your work.',
  "Let's collaborate on something awesome!",
  'Your portfolio is amazing! Quick question...',
]

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/MicoDevPH', icon: 'github', detail: 'View my repositories & contributions' },
  { name: 'Facebook', href: 'https://www.facebook.com/mics12345', icon: 'facebook', detail: 'Follow me for updates & posts' },
  { name: 'Instagram', href: 'https://www.instagram.com/itsmicssss_/', icon: 'instagram', detail: 'Check out my photos & stories' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@micodevph', icon: 'tiktok', detail: 'Watch my short videos & clips' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mico-nakase-0835b1391/',
    icon: 'linkedin',
    detail: 'Connect with me professionally',
  },
  { name: 'Email', href: 'mailto:miconakaseyt@gmail.com', icon: 'mail', detail: 'Send me a message directly' },
]

const inputClass =
  'w-full p-3.5 font-sans text-[15px] text-(--color-text-h) bg-(--color-code-bg) border border-(--color-border) rounded-[10px] outline-none box-border transition-[border-color,box-shadow] duration-250 placeholder:text-(--color-text) placeholder:opacity-60 focus:border-(--color-accent) focus:shadow-[0_0_0_3px_var(--color-accent-bg)]'

export default function Contact() {
  const visible = useInView('contact')
  const { formData, formStatus, handleChange, handleSubmit } = useForm()

  const [messageFocused, setMessageFocused] = useState(false)
  const showTypewriter = !messageFocused && !formData.message
  const typewriterText = useTypewriter(SAMPLE_MESSAGES, !showTypewriter)

  const handleMessageFocus = () => {
    setMessageFocused(true)
  }

  const handleMessageBlur = () => {
    setMessageFocused(false)
  }

  const reveal = (delay = '0s') =>
    `transition-all duration-600 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transition-delay:${delay}] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
    }`

  return (
    <section id="contact" className="w-full pt-35 pb-30 lg:pt-25 lg:pb-20 sm:pt-20 sm:pb-15 box-border">
      <div className="container text-left">
        <h2 className={`font-heading font-black text-(--color-text-h) uppercase leading-[0.88] tracking-[-0.02em] m-0 mb-6 lg:mb-5 sm:mb-4 ${reveal()}`}
          style={{ fontSize: 'clamp(32px, 5.5vw, 80px)' }}>
          Get In <em className="text-(--color-accent) not-italic">Touch</em>
        </h2>
        <p className={`text-(--color-text) max-w-[620px] m-0 mb-12 sm:mb-8 ${reveal('0.1s')}`}
          style={{ fontSize: 'clamp(16px, 1.4vw, 19px)', lineHeight: '1.75' }}>
          Have a project in mind or just want to say hi? Drop me a message!
        </p>
        <div className={`flex gap-15 items-start ${reveal('0.2s')}`}>
          <form className="flex-1 min-w-0" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input className={inputClass} type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input className={inputClass} type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <input className={inputClass} type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <textarea className={`${inputClass} resize-y min-h-[120px] leading-[1.6] ${showTypewriter ? 'opacity-60' : ''}`} name="message" rows="5" value={showTypewriter ? typewriterText : formData.message} onChange={handleChange} onFocus={handleMessageFocus} onBlur={handleMessageBlur} required />
            </div>
            <button
              className="font-sans text-[15px] font-semibold tracking-[0.03em] px-9 py-3.5 rounded-[10px] border-none bg-(--color-accent) text-white cursor-pointer transition-[opacity,transform] duration-250 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {(formStatus === 'success' || formStatus === 'error') && (
              <p className={`mt-4 text-sm ${formStatus === 'success' ? 'text-(--color-green)' : 'text-(--color-red)'}`}>
                {formStatus === 'success'
                  ? 'Message sent successfully!'
                  : 'Failed to send. Please try again.'}
              </p>
            )}
          </form>
          <div className="flex-1 lg:w-full">
            <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-(--color-accent) m-0 mb-6">
              Connect With Me
            </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col px-5 py-3 text-[15px] rounded-[10px] border border-(--color-border) bg-(--color-social-bg) text-(--color-text) no-underline transition-all duration-300 hover:text-(--color-accent) hover:border-(--color-accent) hover:bg-(--color-accent-bg) hover:scale-[1.03] hover:shadow-[0_4px_20px_var(--color-accent-bg)] sm:px-3.5 sm:py-2 sm:text-[13px]"
            >
              <div className="flex items-center gap-3.5">
                <Icon name={link.icon} size={20} />
                <span className="font-medium">{link.name}</span>
              </div>
              <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <span className="block pt-2 text-[12px] text-(--color-text) leading-tight opacity-80 sm:text-[11px]">
                    {link.detail}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
          </div>
        </div>
      </div>
    </section>
  )
}
