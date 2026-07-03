import { useState, useCallback } from 'react'
import emailjs from '@emailjs/browser'

const INITIAL = { name: '', email: '', subject: '', message: '' }

export function useForm() {
  const [formData, setFormData] = useState(INITIAL)
  const [formStatus, setFormStatus] = useState('idle')

  const handleChange = useCallback((e) => {
    setFormData((d) => ({ ...d, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setFormStatus('sending')
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            time: new Date().toLocaleString(),
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        )
        .then(() => {
          setFormStatus('success')
          setFormData(INITIAL)
          setTimeout(() => setFormStatus('idle'), 5000)
        })
        .catch(() => {
          setFormStatus('error')
          setTimeout(() => setFormStatus('idle'), 5000)
        })
    },
    [formData],
  )

  return { formData, setFormData, formStatus, handleChange, handleSubmit }
}
