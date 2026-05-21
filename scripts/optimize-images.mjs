import sharp from 'sharp'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const srcImages = path.join(root, 'src', 'images')
const publicImages = path.join(root, 'public', 'images')
const metaPath = path.join(root, 'src', 'assets', 'image-meta.json')

await mkdir(publicImages, { recursive: true })

const meta = {}

async function writeWebpAvif(outBase, pipeline, { webp = 82, avif = 55 } = {}) {
  await pipeline.clone().webp({ quality: webp }).toFile(`${outBase}.webp`)
  await pipeline.clone().avif({ quality: avif }).toFile(`${outBase}.avif`)
}

async function resizeFrom(srcPath, outBase, width, opts = {}) {
  const pipeline = sharp(srcPath).resize(width, null, {
    withoutEnlargement: true,
    fit: 'inside',
    ...opts.resize,
  })
  await writeWebpAvif(outBase, pipeline, opts)
  const { width: w, height: h } = await sharp(`${outBase}.webp`).metadata()
  return { width: w, height: h }
}

// LCP background → public/ (джерело — повнорозмірний main-bg.webp)
const bgSource = path.join(publicImages, 'main-bg.webp')
const bgBuffer = await sharp(bgSource).toBuffer()
const bgWidths = [640, 1280, 1920]
for (const w of bgWidths) {
  const suffix = w === 1920 ? '' : `-${w}`
  const outBase = path.join(publicImages, `main-bg${suffix}`)
  const dims = await resizeFrom(bgBuffer, outBase, w)
  if (w === 1920) meta.mainBg = dims
}

// Banner photo (~176px display → 352w)
const panelBase = path.join(srcImages, 'solnechnyhPanel')
meta.solnechnyhPanel = await resizeFrom(
  path.join(srcImages, 'solnechnyhPanel.webp'),
  panelBase,
  352,
)

// Carousel (~630px content width)
for (const name of ['FreeSolar2', 'FreeSolar3', 'FreeSolar4']) {
  const outBase = path.join(srcImages, name)
  meta[name] = await resizeFrom(
    path.join(srcImages, `${name}.webp`),
    outBase,
    630,
  )
}

// Footer logo
const logoBase = path.join(srcImages, 'FreeSolar')
meta.FreeSolar = await resizeFrom(
  path.join(srcImages, 'FreeSolar.webp'),
  logoBase,
  400,
)

await writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n')
console.log('Done. Meta:', metaPath)
for (const [k, v] of Object.entries(meta)) {
  console.log(`  ${k}: ${v.width}×${v.height}`)
}
