import sharp from 'sharp'
import path from 'path'
import fs from 'fs-extra'
import { DIR_SMALL, DIR_LARGE } from '../constants.ts'

export async function generateSmall(imagePath: string) {
  console.info('generateSmall STARTED', imagePath)

  const fileName = path.basename(imagePath)
  const outputPath = path.join(DIR_SMALL, fileName)

  await fs.ensureDir(DIR_SMALL)
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
