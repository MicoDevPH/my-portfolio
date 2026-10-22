// Wraps a handler so thrown errors become JSON responses instead of crashes
export function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res)
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ error: 'An item with that slug already exists' })
      }
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  res.status(405).json({ error: 'Method not allowed' })
}

// Keys the client may not set: Mongo ids, timestamps and $-operators
const PROTECTED = new Set(['_id', 'createdAt', 'updatedAt'])

export function cleanBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => !PROTECTED.has(key) && !key.startsWith('$')),
  )
}
