// Converts between what's stored in MongoDB and what the form inputs hold.
// Empty values become `undefined` so they're left out of the saved document,
// which is how the site knows to hide optional bits.

const splitLines = (text) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

export function toForm(field, value) {
  switch (field.type) {
    case 'checkbox':
      return Boolean(value)
    case 'lines':
      return asArray(value).join('\n')
    case 'tags':
      return asArray(value).join(', ')
    case 'credits':
      return Object.fromEntries(field.roles.map((role) => [role, asArray(value?.[role]).join('\n')]))
    case 'links':
      return (value ?? []).map((l) => ({ label: l.label ?? '', url: l.url ?? '' }))
    case 'gallery':
      return (value ?? []).map((g) => ({ src: g.src ?? '', caption: g.caption ?? '' }))
    default:
      return value == null ? '' : String(value)
  }
}

export function fromForm(field, value) {
  switch (field.type) {
    case 'checkbox':
      return value || undefined
    case 'lines': {
      const items = splitLines(value)
      return items.length ? items : undefined
    }
    case 'tags': {
      const items = value
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
      return items.length ? items : undefined
    }
    case 'credits': {
      // One name stays a string, several become a list (shown one per line on the site)
      const entries = Object.entries(value)
        .map(([role, text]) => [role, splitLines(text)])
        .filter(([, names]) => names.length)
        .map(([role, names]) => [role, names.length === 1 ? names[0] : names])
      return entries.length ? Object.fromEntries(entries) : undefined
    }
    case 'links': {
      const links = value
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
        .filter((l) => l.label && l.url)
      return links.length ? links : undefined
    }
    case 'gallery': {
      const shots = value
        .filter((g) => g.src.trim())
        .map((g) => ({ src: g.src.trim(), ...(g.caption.trim() && { caption: g.caption.trim() }) }))
      return shots.length ? shots : undefined
    }
    default: {
      const text = value.trim()
      if (!text) return undefined
      return field.numeric ? Number(text) : text
    }
  }
}

export const emptyForm = (fields) => Object.fromEntries(fields.map((f) => [f.name, toForm(f, undefined)]))

export const itemToForm = (fields, item) =>
  Object.fromEntries(fields.map((f) => [f.name, toForm(f, item[f.name])]))

export function formToItem(fields, form) {
  const item = {}
  for (const field of fields) {
    const value = fromForm(field, form[field.name])
    if (value !== undefined) item[field.name] = value
  }
  return item
}

export function isFilled(field, value) {
  return field.type === 'checkbox' ? true : fromForm(field, value) !== undefined
}
