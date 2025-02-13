import path from 'node:path'
import * as fsPromises from 'fs/promises'
import sharp from 'sharp'
import { IMAGE_SIZES, type ImageSizeDefinition } from '../constants.ts'

async function generateSize(sourceImagePath: string, sizeDef: ImageSizeDefinition) {
  console.info(`generateSize ${sizeDef.name} STARTED`, sourceImagePath)

  // Get file name from path and then replace the extension with desired format
  const pathWithNewExtension = `${sourceImagePath.split('.').slice(0, -1).join('.')}.${sizeDef.format}`
  const outputPath = pathWithNewExtension.replace('images-original', sizeDef.dir)
  const outputDir = path.dirname(outputPath)

  await fsPromises.mkdir(outputDir, { recursive: true }).catch((err) => {
    console.error(err)
  })

  await sharp(sourceImagePath)
    // Auto orient to not lose that EXIF Orientation information
    .rotate()
    .withExifMerge({
      IFD0: {
        Copyright: 'Zefir Efemera',
      },
    })
    .resize({
      fit: sharp.fit.inside,
      width: sizeDef.width,
      height: sizeDef.width,
      kernel: 'lanczos3',
    })
    .sharpen(sizeDef.sharpenOptions)
    .toFormat(sizeDef.format, sizeDef.formatOptions)
    .toFile(outputPath)

  console.info(`generateSize ${sizeDef.name} DONE`, outputPath)

  return outputPath
}

export async function generateSmall(sourceImagePath: string) {
  return generateSize(sourceImagePath, IMAGE_SIZES.small)
}

export async function generateMedium(sourceImagePath: string) {
  return generateSize(sourceImagePath, IMAGE_SIZES.medium)
}

export async function generateLarge(sourceImagePath: string) {
  return generateSize(sourceImagePath, IMAGE_SIZES.large)
}
