import crypto from 'node:crypto'

// Single-admin login: ADMIN_PASSWORD checks the password, SESSION_SECRET signs the cookie.
// Cookie value is "<expiry ms>.<hmac>", so it can't be forged or extended without the secret.
const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

function env(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

const sign = (data) => crypto.createHmac('sha256', env('SESSION_SECRET')).update(data).digest('base64url')
const sha256 = (text) => crypto.createHash('sha256').update(String(text)).digest()

// Constant-time compare; hashing first makes both sides the same length
const safeEqual = (a, b) => crypto.timingSafeEqual(sha256(a), sha256(b))

export function checkPassword(password) {
  return typeof password === 'string' && safeEqual(password, env('ADMIN_PASSWORD'))
}

export function sessionCookie() {
  const expiry = String(Date.now() + MAX_AGE * 1000)
  return `${COOKIE}=${expiry}.${sign(expiry)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
}

export function clearedCookie() {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
}

export function isAdmin(req) {
  const match = (req.headers.cookie ?? '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [expiry, signature] = match[1].split('.')
  return Boolean(expiry && signature) && safeEqual(signature, sign(expiry)) && Number(expiry) > Date.now()
}

// Sends 401 and returns false when the request isn't from a logged-in admin
export function requireAdmin(req, res) {
  if (isAdmin(req)) return true
  res.status(401).json({ error: 'Not logged in' })
  return false
}
