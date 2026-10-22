// POST /api/logout  clears the admin session cookie
import { clearedCookie } from './_lib/auth.js'
import { handle, methodNotAllowed } from './_lib/http.js'

export default handle(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  res.setHeader('Set-Cookie', clearedCookie())
  res.status(200).json({ admin: false })
})
