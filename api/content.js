// GET /api/content  every collection in one response, for the portfolio's first load (public)
import { getDb } from './_lib/db.js'
import { COLLECTIONS } from './_lib/collections.js'
import { handle, methodNotAllowed } from './_lib/http.js'

export default handle(async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const db = await getDb()
  const entries = await Promise.all(
    Object.keys(COLLECTIONS).map(async (name) => [
      name,
      await db.collection(name).find().sort({ order: 1 }).toArray(),
    ]),
  )
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
  res.status(200).json(Object.fromEntries(entries))
})
