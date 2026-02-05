import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const assetsDir = path.join(process.cwd(), 'src', 'assets')

const imagesToOptimize = [
  'contact_image.png',
  'header_img.png',
  'about_image.png',
  'appointment_img.png',
  'profile_pic.png'
]

async function optimize() {
  for (const img of imagesToOptimize) {
    const inputPath = path.join(assetsDir, img)
    if (!fs.existsSync(inputPath)) {
      console.warn(`Skipping (not found): ${inputPath}`)
      continue
    }

    const outputName = img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    const outputPath = path.join(assetsDir, outputName)

    try {
      await sharp(inputPath)
        .resize({ width: 1200 })
        .webp({ quality: 75 })
        .toFile(outputPath)
      console.log(`Optimized: ${outputName}`)
    } catch (err) {
      console.error(`Failed to optimize ${img}:`, err)
    }
  }
}

optimize()
  .then(() => console.log('Image optimization complete'))
  .catch((err) => console.error(err))
