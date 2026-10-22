// Runs the api/ functions locally, the same way Vercel routes them:
//   /api/login → api/login.js, /api/music → api/[collection].js, /api/music/123 → api/[collection]/[id].js
// Start with `npm run dev:api`; Vite proxies /api here.
import http from 'node:http'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const PORT = 3001
const API_DIR = path.resolve('api')

function resolveRoute(pathname) {
  const parts = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)
  if (parts.length === 1 && !parts[0].startsWith('_')) {
    const file = path.join(API_DIR, `${parts[0]}.js`)
    if (existsSync(file)) return { file, params: {} }
    return { file: path.join(API_DIR, '[collection].js'), params: { collection: parts[0] } }
  }
  if (parts.length === 2) {
    return { file: path.join(API_DIR, '[collection]', '[id].js'), params: { collection: parts[0], id: parts[1] } }
  }
  return null
}

async function readJson(req) {
  if (!req.headers['content-type']?.includes('application/json')) return undefined
  let raw = ''
  for await (const chunk of req) raw += chunk
  return raw ? JSON.parse(raw) : undefined
}

// Adds the helpers Vercel gives handlers: req.query, req.body, res.status(), res.json()
function withHelpers(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
  return res
}

http
  .createServer(async (req, res) => {
    withHelpers(res)
    const url = new URL(req.url, `http://localhost:${PORT}`)
    const route = url.pathname.startsWith('/api') && resolveRoute(url.pathname)
    if (!route) return res.status(404).json({ error: 'No such API route' })

    try {
      req.query = { ...Object.fromEntries(url.searchParams), ...route.params }
      req.body = await readJson(req)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
    const { default: handler } = await import(pathToFileURL(route.file))
    await handler(req, res)
    console.log(`${req.method} ${url.pathname} → ${res.statusCode}`)
  })
  .listen(PORT, () => console.log(`API running at http://localhost:${PORT}/api`))
