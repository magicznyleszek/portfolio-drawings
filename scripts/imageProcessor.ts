import path from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'
import { IMAGE_SIZES, type ImageSizeDefinition } from '../constants.ts'

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
    .sharpen(sizeDefnition.sharpenOptions)
    .toFormat(sizeDefnition.format, sizeDefnition.formatOptions)
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
