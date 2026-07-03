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
