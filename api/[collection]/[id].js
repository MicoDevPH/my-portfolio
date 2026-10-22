// GET    /api/:collection/:id  one item (public)
// PUT    /api/:collection/:id  replace an item with the sent fields (admin)
// DELETE /api/:collection/:id  delete an item (admin)
import { getDb, ObjectId } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { COLLECTIONS, missingFields } from '../_lib/collections.js'
import { cleanBody, handle, methodNotAllowed } from '../_lib/http.js'

export default handle(async (req, res) => {
  const { collection: name, id } = req.query
  const config = COLLECTIONS[name]
  if (!config) return res.status(404).json({ error: 'Unknown collection' })
  if (!ObjectId.isValid(id)) return res.status(404).json({ error: 'Not found' })
  const col = (await getDb()).collection(name)
  const _id = new ObjectId(id)

  if (req.method === 'GET') {
    const item = await col.findOne({ _id })
    return item ? res.status(200).json(item) : res.status(404).json({ error: 'Not found' })
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return
    const data = cleanBody(req.body)
    if (!data) return res.status(400).json({ error: 'Expected a JSON object' })
    const missing = missingFields(config, data)
    if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` })

    const existing = await col.findOne({ _id })
    if (!existing) return res.status(404).json({ error: 'Not found' })
    // Keep the slug and order unless the admin sends new ones, so URLs don't break on rename
    const item = {
      ...data,
      ...(config.slug && { slug: data.slug || existing.slug }),
      order: data.order ?? existing.order,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    }
    await col.replaceOne({ _id }, item)
    return res.status(200).json({ ...item, _id })
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return
    const { deletedCount } = await col.deleteOne({ _id })
    return deletedCount ? res.status(204).end() : res.status(404).json({ error: 'Not found' })
  }

  methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
})
