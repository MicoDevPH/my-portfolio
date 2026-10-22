// GET  /api/:collection  list items, sorted by `order` (public)
// POST /api/:collection  create an item (admin)
import { getDb } from './_lib/db.js'
import { requireAdmin } from './_lib/auth.js'
import { COLLECTIONS, missingFields } from './_lib/collections.js'
import { cleanBody, handle, methodNotAllowed } from './_lib/http.js'
import { slugify } from '../src/lib/slugify.js'

export default handle(async (req, res) => {
  const name = req.query.collection
  const config = COLLECTIONS[name]
  if (!config) return res.status(404).json({ error: 'Unknown collection' })
  const col = (await getDb()).collection(name)

  if (req.method === 'GET') {
    const items = await col.find().sort({ order: 1 }).toArray()
    // CDN keeps it for 30s, then serves stale while refreshing in the background
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
    return res.status(200).json(items)
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return
    const data = cleanBody(req.body)
    if (!data) return res.status(400).json({ error: 'Expected a JSON object' })
    const missing = missingFields(config, data)
    if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` })

    if (config.slug && !data.slug) data.slug = slugify(data.title)
    if (data.order === undefined) {
      const last = await col.find().sort({ order: -1 }).limit(1).next()
      data.order = (last?.order ?? -1) + 1
    }
    const now = new Date()
    const item = { ...data, createdAt: now, updatedAt: now }
    const { insertedId } = await col.insertOne(item)
    return res.status(201).json({ ...item, _id: insertedId })
  }

  methodNotAllowed(res, ['GET', 'POST'])
})
