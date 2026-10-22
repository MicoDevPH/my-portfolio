import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import { SECTIONS } from './schema'
import Login from './components/Login'
import CollectionView from './components/CollectionView'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://miconakase.xyz'

// Remember the open section across refreshes via #music, #projects, …
const sectionFromHash = () => SECTIONS.find((s) => `#${s.key}` === window.location.hash) ?? SECTIONS[0]

export default function App() {
  const [auth, setAuth] = useState('checking') // 'checking' | 'in' | 'out'
  const [section, setSection] = useState(sectionFromHash)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .me()
      .then((r) => setAuth(r.admin ? 'in' : 'out'))
      .catch(() => setAuth('out'))
  }, [])

  // Any 401 means the session expired: back to the login screen
  const onError = useCallback((err) => {
    if (err.status === 401) setAuth('out')
    else setError(err.message)
  }, [])

  const openSection = (s) => {
    window.history.replaceState(null, '', `#${s.key}`)
    setSection(s)
    setError('')
  }

  const logout = async () => {
    await api.logout().catch(() => {})
    setAuth('out')
  }

  if (auth === 'checking') return <p className="nb-eyebrow p-8">Loading…</p>
  if (auth === 'out') return <Login onLogin={() => setAuth('in')} />

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-(--color-surface) border-b-[3px] border-(--color-ink)">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="font-pixel text-[12px]">
            <span className="text-(--color-red)">MLN.</span> Admin
          </span>
          <div className="flex gap-2">
            <a className="nb-btn nb-btn-sm nb-press no-underline" href={SITE_URL} target="_blank" rel="noopener noreferrer">
              View site ↗
            </a>
            <button className="nb-btn nb-btn-sm nb-press" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`nb-btn nb-btn-sm nb-press ${s.key === section.key ? 'nb-btn-yellow' : ''}`}
              onClick={() => openSection(s)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="m-0 mb-6 font-display font-bold uppercase text-[44px] leading-none">{section.label}</h1>
        {error && (
          <p className="nb-box m-0 mb-5 px-4 py-3 font-semibold flex justify-between gap-4">
            <span className="text-(--color-red)">{error}</span>
            <button className="nb-btn nb-btn-sm" onClick={() => setError('')}>Dismiss</button>
          </p>
        )}
        <CollectionView key={section.key} section={section} onError={onError} />
      </main>
    </div>
  )
}
