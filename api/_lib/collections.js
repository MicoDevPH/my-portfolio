// Collections the API exposes. `required` fields must be non-empty on create/update;
// `slug: true` collections get a URL slug generated from the title.
export const COLLECTIONS = {
  music: { required: ['title'], slug: true },
  projects: { required: ['title'], slug: true },
  timeline: { required: ['title', 'date', 'type'] },
  skills: { required: ['name', 'group'] },
}

export function missingFields(config, data) {
  return config.required.filter((field) => !data[field])
}
