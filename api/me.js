// GET /api/me  tells the admin app whether it's logged in
import { isAdmin } from './_lib/auth.js'
import { handle, methodNotAllowed } from './_lib/http.js'

export default handle(async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ admin: isAdmin(req) })
})
