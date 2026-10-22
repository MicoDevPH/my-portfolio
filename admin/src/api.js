// Talks to the portfolio API at /api (proxied to miconakase.xyz in production, the
// local API server in development), so the login cookie stays same-origin.

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status)
  return data
}

export const api = {
  me: () => request('/me'),
  login: (password) => request('/login', { method: 'POST', body: { password } }),
  logout: () => request('/logout', { method: 'POST' }),
  // Timestamp skips the 30s CDN cache so you always see your latest edits
  list: (collection) => request(`/${collection}?t=${Date.now()}`),
  create: (collection, item) => request(`/${collection}`, { method: 'POST', body: item }),
  update: (collection, id, item) => request(`/${collection}/${id}`, { method: 'PUT', body: item }),
  remove: (collection, id) => request(`/${collection}/${id}`, { method: 'DELETE' }),
}

// Uploads straight from the browser to Cloudinary with a signature from our API,
// so big MP3s never pass through a serverless function. Returns the file's URL.
export async function uploadFile(file, folder) {
  const sig = await request('/upload-signature', { method: 'POST', body: { folder } })
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', sig.apiKey)
  form.append('timestamp', sig.timestamp)
  form.append('signature', sig.signature)
  form.append('folder', sig.folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}
