// POST /api/upload-signature { folder }  signs a direct browser → Cloudinary upload (admin).
// The API secret never leaves the server; the browser only gets a one-time signature.
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from './_lib/auth.js'
import { handle, methodNotAllowed } from './_lib/http.js'

const FOLDERS = ['music', 'projects']

export default handle(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  if (!requireAdmin(req, res)) return

  const folder = req.body?.folder
  if (!FOLDERS.includes(folder)) {
    return res.status(400).json({ error: `folder must be one of: ${FOLDERS.join(', ')}` })
  }
  const params = { folder: `portfolio/${folder}`, timestamp: Math.round(Date.now() / 1000) }
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

  res.status(200).json({
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  })
})
