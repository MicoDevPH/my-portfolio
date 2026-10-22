// What each admin section edits. Field types are handled in lib/formValues.js
// (value conversion) and components/fields.jsx (inputs).
//   text · textarea · url · month · select · checkbox
//   lines   one item per line → array
//   tags    comma-separated → array
//   image / audio   Cloudinary upload (or paste a URL)
//   credits · links · gallery   structured editors

const CREDIT_ROLES = ['artist', 'vocals', 'lyricist', 'composer', 'arranger', 'producer', 'mixing']

export const SECTIONS = [
  {
    key: 'music',
    label: 'Music',
    noun: 'track',
    plural: 'tracks',
    title: (item) => item.title,
    subtitle: (item) => [item.genre, item.year, item.award].filter(Boolean).join(' · '),
    thumb: 'img',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'desc', label: 'Short description', type: 'textarea', rows: 2, hint: 'Shown on the track card' },
      { name: 'longDesc', label: 'Long description', type: 'textarea', rows: 4, hint: 'Shown in the Details popup' },
      { name: 'year', label: 'Year', type: 'text', half: true },
      { name: 'genre', label: 'Genre', type: 'text', half: true },
      { name: 'award', label: 'Award / badge', type: 'text', hint: 'e.g. "1st Runner Up · Musikaligtasan 2025"' },
      { name: 'img', label: 'Cover image', type: 'image', folder: 'music' },
      { name: 'audio', label: 'Audio (MP3)', type: 'audio', folder: 'music' },
      { name: 'credits', label: 'Credits', type: 'credits', roles: CREDIT_ROLES, hint: 'One name per line' },
      { name: 'links', label: 'Links', type: 'links', hint: 'e.g. YouTube, Spotify' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    noun: 'project',
    plural: 'projects',
    title: (item) => item.title,
    subtitle: (item) => [item.featured && '★ Featured', item.role, item.year].filter(Boolean).join(' · '),
    thumb: 'img',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'desc', label: 'Short description', type: 'textarea', rows: 2, hint: 'Shown on the cartridge card' },
      { name: 'longDesc', label: 'Long description', type: 'textarea', rows: 4, hint: 'Shown on the project page' },
      { name: 'year', label: 'Year', type: 'text', half: true },
      { name: 'role', label: 'Role', type: 'text', half: true, hint: 'e.g. "Solo · Design & Development"' },
      { name: 'featured', label: 'Featured (wide spotlight card)', type: 'checkbox' },
      { name: 'tags', label: 'Tech tags', type: 'tags', hint: 'Comma-separated. Icons exist for: Html5, CSS3, PHP, React, NodeJS, Python, Vite, Tailwind' },
      { name: 'features', label: 'Key features', type: 'lines', rows: 4, hint: 'One per line' },
      { name: 'outcome', label: 'Outcome', type: 'textarea', rows: 2 },
      { name: 'live', label: 'Live URL', type: 'url', half: true },
      { name: 'github', label: 'GitHub URL', type: 'url', half: true },
      { name: 'img', label: 'Cover image', type: 'image', folder: 'projects' },
      { name: 'gallery', label: 'Gallery', type: 'gallery', folder: 'projects', hint: 'Extra screenshots under Key Features' },
    ],
  },
  {
    key: 'timeline',
    label: 'Journey',
    noun: 'entry',
    plural: 'entries',
    title: (item) => item.title,
    subtitle: (item) => [item.subtitle, item.date, item.minor && 'hidden behind "Show more"'].filter(Boolean).join(' · '),
    badge: (item) => ({ work: 'Work', lead: 'Lead', edu: 'Edu' })[item.type],
    note: 'The site sorts entries by year automatically. Order here only breaks ties within the same year and type.',
    fields: [
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
          { value: 'work', label: 'Work' },
          { value: 'lead', label: 'Leadership' },
          { value: 'edu', label: 'Education' },
        ],
      },
      { name: 'title', label: 'Title', type: 'text', required: true, hint: 'e.g. "Junior AI Engineer"' },
      { name: 'subtitle', label: 'Organization', type: 'text' },
      { name: 'date', label: 'Date', type: 'text', required: true, hint: 'e.g. "Sep 2026 – Present". The first 4-digit year sorts it; "Present" marks it current.' },
      { name: 'minor', label: 'Minor (hide behind "Show more")', type: 'checkbox' },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    noun: 'skill',
    plural: 'skills',
    title: (item) => item.name,
    subtitle: (item) => [item.category, item.startDate && `since ${item.startDate}`].filter(Boolean).join(' · '),
    badge: (item) => (item.party ? `Party ${item.party}` : item.group),
    thumb: 'icon',
    note: 'Order here is the order inside each PC Box group.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, half: true },
      {
        name: 'group',
        label: 'PC Box group',
        type: 'select',
        required: true,
        half: true,
        options: ['AI', 'Frontend', 'Backend', 'Tools'].map((g) => ({ value: g, label: g })),
      },
      { name: 'category', label: 'Category', type: 'text', half: true, hint: 'e.g. Language, Framework, Tool' },
      { name: 'startDate', label: 'Using since', type: 'month', half: true, hint: 'Drives the "Lv." (one level per month)' },
      { name: 'icon', label: 'Icon URL', type: 'url', preview: true, hint: 'An SVG link, e.g. from cdn.jsdelivr.net/npm/devicon' },
      {
        name: 'party',
        label: 'Party slot',
        type: 'select',
        numeric: true,
        options: [{ value: '', label: 'None (PC Box)' }, ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `Slot ${n}` }))],
        hint: 'Featured cards on the site. Give each slot to one skill only.',
      },
    ],
  },
]
