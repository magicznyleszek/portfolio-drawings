import path from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'
import { IMAGE_SIZES, type ImageSizeDefinition } from '../constants.ts'

async function generateSize(imagePath: string, sizeDefnition: ImageSizeDefinition) {
  console.info(`generateSize ${sizeDefnition.name} STARTED`, imagePath)

  const fileName = path.basename(imagePath)
  const outputPath = path.join(sizeDefnition.dir, fileName)

  await fs.ensureDir(sizeDefnition.dir)
  // TODO make a better thumbnail, use some more sharp magick
  // maybe have 3 sizes?:
  // small: very tiny image 40px?, will be used in index page to just show what's inside a category
  // medium: thumbnail with everything visible in it (300px?), used on category page
  // large: on single image page
  await sharp(imagePath).resize(sizeDefnition.width).toFile(outputPath)

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
