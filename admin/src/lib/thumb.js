// Small, compressed Cloudinary previews so the admin doesn't download multi-MB originals
const UPLOAD = '/image/upload/'

export function thumb(url, size) {
  if (!url?.includes('res.cloudinary.com') || !url.includes(UPLOAD)) return url
  return url.replace(UPLOAD, `${UPLOAD}f_auto,q_auto,c_fill,w_${size},h_${size}/`)
}
