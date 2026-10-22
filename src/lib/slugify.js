// URL-safe id for a work, used in #/works/<slug>. Shared with the API.
export const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
