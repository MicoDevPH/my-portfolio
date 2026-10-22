import { fileURLToPath } from 'node:url'

// Vite turns `import img from './x.png'` into a URL. In Node we turn it into
// the file's absolute path instead, so the seed script can upload it.
const ASSET = /\.(png|jpe?g|webp|gif|svg|mp3|wav|ogg)$/i

export async function load(url, context, nextLoad) {
  if (ASSET.test(url)) {
    return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(fileURLToPath(url))}` }
  }
  return nextLoad(url, context)
}
