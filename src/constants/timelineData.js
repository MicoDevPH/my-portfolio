// `minor` entries are tucked behind "Show more" on the Journey timeline

export const educationData = [
  { date: '2022 – Present', title: 'BS in Information Technology', subtitle: 'Saint Francis Institute of Computer Studies' },
  { date: '2020 – 2022', title: 'STEM (Senior High School)', subtitle: 'San Francisco De Sales School' },
  { date: '2016 – 2020', title: 'Junior High School', subtitle: 'Adelina I National High School' },
  { date: '2014 – 2016', title: 'Elementary', subtitle: 'San Pedro Central Elementary School', minor: true },
  { date: '2010 – 2014', title: 'Elementary', subtitle: 'Adonai Christian Academy of Muntinlupa', minor: true },
  { date: '2009 – 2010', title: 'Kindergarten', subtitle: 'Laguna Northwestern College', minor: true },
]

export const experienceData = [
  { date: 'Sep 2026 – Present', title: 'Junior AI Engineer', subtitle: 'Prosperna Philippines' },
  { date: 'Feb 2026 – Jul 2026', title: 'Full Stack & Generative AI Developer Intern', subtitle: 'Prosperna Philippines' },
]

export const leadershipData = [
  { date: '2024 – 2026', title: 'SBO President', subtitle: 'Saint Francis Institute of Computer Studies' },
  { date: '2024 – Present', title: 'External Vice President', subtitle: 'Truchorus Performance Company' },
  { date: '2023 – 2024', title: 'SBO Vice President', subtitle: 'Saint Francis Institute of Computer Studies' },
  { date: '2022 – 2023', title: 'President', subtitle: 'Cascop Compound Youth Organization' },
  { date: '2021', title: 'SSC Business Manager', subtitle: 'San Francisco De Sales School' },
  { date: '2019', title: 'SSG Federation Peace Officer', subtitle: 'San Pedro City, Laguna', minor: true },
  { date: '2019', title: 'Junior Barangay Official – 2nd Councilor', subtitle: 'Barangay San Antonio, San Pedro City, Laguna', minor: true },
  { date: '2019', title: 'SSG President', subtitle: 'Adelina I National High School', minor: true },
  { date: '2018', title: 'SSG P.I.O.', subtitle: 'Adelina I National High School', minor: true },
  { date: '2017', title: 'SSG Auxiliary', subtitle: 'Adelina I National High School', minor: true },
  { date: '2017', title: 'Interact Club P.O. Boy', subtitle: 'Adelina I National High School', minor: true },
]

// Same year: work first, then leadership, then education
const TYPE_ORDER = { work: 0, lead: 1, edu: 2 }
const startYear = (date) => Number(date.match(/\d{4}/)?.[0] ?? 0)

// Every entry in one list, newest first
export const journeyData = [
  ...experienceData.map((e) => ({ ...e, type: 'work' })),
  ...leadershipData.map((e) => ({ ...e, type: 'lead' })),
  ...educationData.map((e) => ({ ...e, type: 'edu' })),
]
  .map((e, i) => ({ ...e, order: i, year: startYear(e.date), current: e.date.includes('Present') }))
  .sort((a, b) => b.year - a.year || TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.order - b.order)
