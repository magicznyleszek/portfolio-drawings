import 'tsx/esm'
import type UserConfig from './UserConfig.d.ts'
import { scanImages, type ScannedImage } from './scripts/fileScanner.ts'
import { generateSmall, generateLarge } from './scripts/imageProcessor.ts'
import { DIR_SMALL, DIR_LARGE } from './constants.ts'

interface ImageWithSizes extends ScannedImage {
  small: string
  large: string
}

export default async function (eleventyConfig: UserConfig) {
  // Ignore some files from output site
  eleventyConfig.ignores.add('README.md')

  // Add "images" collection
  console.info('scan and generate images STARTED')
  const images: ImageWithSizes[] = []
  // scan directories
  const sourceImages = await scanImages('images-original')
  // generate additional images
  await Promise.all(
    sourceImages.map(async (image) => {
      images.push({
        ...image,
        small: await generateSmall(image.file),
        large: await generateLarge(image.file),
      })
    }),
  )
  console.info('scan and generate images DONE')
  eleventyConfig.addCollection('images', async () => images)

  // Include generated images files
  eleventyConfig.addPassthroughCopy('images-original')
  eleventyConfig.addPassthroughCopy(DIR_SMALL)
  eleventyConfig.addPassthroughCopy(DIR_LARGE)
}
