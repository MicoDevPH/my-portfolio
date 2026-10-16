export function calcDuration(startDate) {
  if (!startDate) return null

  const start = new Date(startDate + '-01')
  const now = new Date()

  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  if (years === 0) return `${months} months`
  if (months === 0) return `${years} years`
  return `${years} years, ${months} months`
}

// '2026-03' → local Date (avoids the UTC shift of new Date('2026-03-01'))
function parseMonth(startDate) {
  const [y, m] = startDate.split('-').map(Number)
  return new Date(y, m - 1, 1)
}

// Pokémon-style level: one level per month of use, from Lv. 1 up to Lv. 100
export function calcLevel(startDate) {
  if (!startDate) return 1
  const start = parseMonth(startDate)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.min(100, Math.max(1, months))
}

// '2026-03' → 'Mar 2026'
export function formatSince(startDate) {
  if (!startDate) return ''
  return parseMonth(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
