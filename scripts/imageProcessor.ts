import path from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'
import { IMAGE_SIZES, type ImageSizeDefinition } from '../constants.ts'

// Sometimes we want to have no sharpening, so to make things easier (?) we have this zero sharpening options:
const SHARPEN_OPTIONS_NONE: sharp.SharpenOptions = {
  sigma: 1,
  m1: 0,
  m2: 0,
  x1: 0,
  y2: 0,
  y3: 0,
}
const SHARPEN_OPTIONS: sharp.SharpenOptions = {
  sigma: 4,
  m1: 0.5,
  m2: 3,
  x1: 200,
  y2: 1,
  y3: 2,
}
const SHARPEN_LIMIT = 500

async function generateSize(imagePath: string, sizeDefnition: ImageSizeDefinition) {
  console.info(`generateSize ${sizeDefnition.name} STARTED`, imagePath)

  const fileName = path.basename(imagePath)
  const outputPath = path.join(sizeDefnition.dir, fileName)

  await fs.ensureDir(sizeDefnition.dir)
  await sharp(imagePath)
    .withExifMerge({
      IFD0: {
        Copyright: 'Zefir Efemera',
      },
    })
    .resize({
      fit: sharp.fit.inside,
      width: sizeDefnition.width,
      height: sizeDefnition.width,
      kernel: 'lanczos3',
    })
    .sharpen(sizeDefnition.width > SHARPEN_LIMIT ? SHARPEN_OPTIONS_NONE : SHARPEN_OPTIONS)
    .jpeg({
      quality: 80,
      // Progressive is better than baseline
      progressive: true,
      // Better compression, but slower
      mozjpeg: true,
    })
    .toFile(outputPath)

  console.info(`generateSize ${sizeDefnition.name} DONE`, outputPath)

  return outputPath
}

export async function generateSmall(imagePath: string) {
  return generateSize(imagePath, IMAGE_SIZES.small)
}

export async function generateMedium(imagePath: string) {
  return generateSize(imagePath, IMAGE_SIZES.medium)
}

export async function generateLarge(imagePath: string) {
  return generateSize(imagePath, IMAGE_SIZES.large)
}
