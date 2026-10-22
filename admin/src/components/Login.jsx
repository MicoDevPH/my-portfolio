import { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.login(password)
      onLogin()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="nb-box w-full max-w-sm p-7 flex flex-col gap-5">
        <div>
          <p className="nb-eyebrow m-0 mb-3">
            <span className="text-(--color-red)">MLN.</span> · Admin
          </p>
          <h1 className="m-0 font-display font-bold uppercase text-[36px] leading-none">Log in</h1>
        </div>
        <input
          type="password"
          className="nb-input"
          placeholder="Password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="m-0 font-semibold text-(--color-red)">{error}</p>}
        <button type="submit" className="nb-btn nb-btn-yellow nb-press" disabled={loading || !password}>
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </main>
  )
}
