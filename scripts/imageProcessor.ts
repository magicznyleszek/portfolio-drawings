import path from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'
import { DIR_LARGE, DIR_SMALL } from '../constants.ts'

export async function generateSmall(imagePath: string) {
  console.info('generateSmall STARTED', imagePath)

  const fileName = path.basename(imagePath)
  const outputPath = path.join(DIR_SMALL, fileName)

  await fs.ensureDir(DIR_SMALL)
  // TODO make a better thumbnail, use some more sharp magick
  // maybe have 3 sizes?:
  // small: very tiny image 40px?, will be used in index page to just show what's inside a category
  // medium: thumbnail with everything visible in it (300px?), used on category page
  // large: on single image page
  await sharp(imagePath).resize(300).toFile(outputPath)

  console.info('generateSmall DONE', outputPath)

  return outputPath
}

export async function generateLarge(imagePath: string) {
  console.info('generateLarge STARTED', imagePath)

  const fileName = path.basename(imagePath)
  const outputPath = path.join(DIR_LARGE, fileName)

  await fs.ensureDir(DIR_LARGE)
  await sharp(imagePath).resize(1200).toFile(outputPath)

  console.info('generateLarge DONE', outputPath)

  return outputPath
}
