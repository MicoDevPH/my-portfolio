// Portfolio content (music, projects, timeline, skills) from the MongoDB-backed API
export async function fetchContent() {
  const res = await fetch('/api/content')
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
