// Copies the hardcoded portfolio data into MongoDB and its images/MP3s into Cloudinary.
//   npm run seed -- --dry-run   preview the documents, upload nothing
//   npm run seed                upload media + insert into empty collections
//   npm run seed -- --reset     same, but clears the collections first
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import { musicWorks, programmingWorks, slugify } from '../src/constants/worksData.js'
import { educationData, experienceData, leadershipData } from '../src/constants/timelineData.js'
import { boxGroups } from '../src/constants/skillsData.js'

const DRY_RUN = process.argv.includes('--dry-run')
const RESET = process.argv.includes('--reset')
const COLLECTIONS = ['music', 'projects', 'timeline', 'skills']

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Uploads a local file once and returns its Cloudinary URL
const uploaded = new Map()
async function upload(filePath, folder, publicId) {
  if (!filePath) return undefined
  if (DRY_RUN) return `<upload ${path.basename(filePath)} → portfolio/${folder}/${publicId}>`
  if (!uploaded.has(filePath)) {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: `portfolio/${folder}`,
      public_id: publicId,
      resource_type: 'auto', // MP3s are stored as Cloudinary "video" resources
      overwrite: true,
    })
    console.log(`  uploaded ${path.basename(filePath)}`)
    uploaded.set(filePath, res.secure_url)
  }
  return uploaded.get(filePath)
}

// Drops keys whose value is undefined so documents stay clean
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

async function buildDocs() {
  const now = new Date()
  const stamp = (doc) => ({ ...clean(doc), createdAt: now, updatedAt: now })

  const music = []
  for (const [order, w] of musicWorks.entries()) {
    const slug = slugify(w.title)
    music.push(stamp({
      ...w,
      slug,
      order,
      img: await upload(w.img, 'music', `${slug}-cover`),
      audio: await upload(w.audio, 'music', `${slug}-audio`),
    }))
  }

  const projects = []
  for (const [order, w] of programmingWorks.entries()) {
    const slug = slugify(w.title)
    const gallery = w.gallery && []
    for (const [i, g] of (w.gallery ?? []).entries()) {
      gallery.push({ ...g, src: await upload(g.src, 'projects', `${slug}-gallery-${i + 1}`) })
    }
    projects.push(stamp({ ...w, slug, order, img: await upload(w.img, 'projects', `${slug}-cover`), gallery }))
  }

  const timeline = [
    ...experienceData.map((e) => ({ ...e, type: 'work' })),
    ...leadershipData.map((e) => ({ ...e, type: 'lead' })),
    ...educationData.map((e) => ({ ...e, type: 'edu' })),
  ].map((e, order) => stamp({ ...e, order }))

  const skills = boxGroups
    .flatMap((g) => g.tools.map((t) => ({ ...t, group: g.title })))
    .map((t, order) => stamp({ ...t, order }))

  return { music, projects, timeline, skills }
}

async function main() {
  const docs = await buildDocs()

  if (DRY_RUN) {
    for (const name of COLLECTIONS) {
      console.log(`\n=== ${name} (${docs[name].length}) ===`)
      console.dir(docs[name], { depth: null })
    }
    console.log('\nDry run only: nothing was uploaded or saved.')
    return
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  try {
    await client.connect()
    const db = client.db()
    for (const name of COLLECTIONS) {
      const col = db.collection(name)
      if (RESET) await col.deleteMany({})
      else if (await col.estimatedDocumentCount()) {
        console.log(`skipped ${name}: already has data (use --reset to replace it)`)
        continue
      }
      await col.insertMany(docs[name])
      console.log(`inserted ${docs[name].length} into ${name}`)
    }
    await db.collection('music').createIndex({ slug: 1 }, { unique: true })
    await db.collection('projects').createIndex({ slug: 1 }, { unique: true })
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
