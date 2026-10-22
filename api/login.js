// POST /api/login { password }  sets the admin session cookie
import { checkPassword, sessionCookie } from './_lib/auth.js'
import { handle, methodNotAllowed } from './_lib/http.js'

export default handle(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  if (!checkPassword(req.body?.password)) {
    // Slow down password guessing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return res.status(401).json({ error: 'Wrong password' })
  }
  res.setHeader('Set-Cookie', sessionCookie())
  res.status(200).json({ admin: true })
})
