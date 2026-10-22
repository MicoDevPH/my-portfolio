// Shapes raw API content into what the sections render

// Cloudinary serves WebP/AVIF at a sensible quality and size when asked via the URL
const CLOUDINARY_IMAGE = '/image/upload/'
export function optimizeImage(url) {
  if (!url?.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_IMAGE)) return url
  return url.replace(CLOUDINARY_IMAGE, `${CLOUDINARY_IMAGE}f_auto,q_auto,c_limit,w_1600/`)
}

export function prepareMusic(music) {
  return music.map((t) => ({ ...t, img: optimizeImage(t.img) }))
}

export function prepareProjects(projects) {
  return projects.map((p) => ({
    ...p,
    img: optimizeImage(p.img),
    gallery: p.gallery?.map((g) => ({ ...g, src: optimizeImage(g.src) })),
  }))
}

// Same year: work first, then leadership, then education
const TYPE_ORDER = { work: 0, lead: 1, edu: 2 }
const startYear = (date) => Number(date.match(/\d{4}/)?.[0] ?? 0)

// Every timeline entry in one list, newest first. `minor` entries hide behind "Show more".
export function buildJourney(timeline) {
  return timeline
    .map((e) => ({ ...e, year: startYear(e.date), current: e.date.includes('Present') }))
    .sort((a, b) => b.year - a.year || TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.order - b.order)
}

// `party: 1-6` = featured card slot (in that order); everything else goes in the PC Box,
// grouped in the order groups first appear.
export function buildSkills(skills) {
  const party = skills.filter((t) => t.party).sort((a, b) => a.party - b.party)

  const groups = new Map()
  for (const tool of skills) {
    if (!groups.has(tool.group)) groups.set(tool.group, [])
    if (!tool.party) groups.get(tool.group).push(tool)
  }
  // Stagger order for the box chips: continues after the party cards
  let chipOrder = party.length
  const box = [...groups]
    .filter(([, tools]) => tools.length > 0)
    .map(([title, tools]) => ({ title, stored: tools.map((t) => ({ ...t, stagger: chipOrder++ })) }))

  return { party, box, boxCount: chipOrder - party.length }
}
