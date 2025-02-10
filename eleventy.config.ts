import 'tsx/esm'
import _ from 'lodash'
import type UserConfig from './UserConfig.d.ts'
import { IMAGE_SIZES } from './constants.ts'
import { type ScannedImage, type ScannedImageCategory, scanImages } from './scripts/fileScanner.ts'
import { generateLarge, generateMedium, generateSmall } from './scripts/imageProcessor.ts'

interface ImageWithSizes extends ScannedImage {
  small: string
  medium: string
  large: string
}

interface Category extends ScannedImageCategory {
  images: ImageWithSizes[]
}

export default async function (eleventyConfig: UserConfig) {
  eleventyConfig.setFrontMatterParsingOptions({ language: 'json' })

  // Ignore some files from output site
  eleventyConfig.ignores.add('README.md')

  // Add "images" collection
  console.info('scan and generate images STARTED')
  let images: ImageWithSizes[] = []
  // scan directories
  const sourceImages = await scanImages('images-original')
  // generate additional images
  await Promise.all(
    sourceImages.map(async (image) => {
      images.push({
        ...image,
        small: await generateSmall(image.file),
        medium: await generateMedium(image.file),
        large: await generateLarge(image.file),
      })
    }),
  )
  console.info('scan and generate images DONE')

  // We sort images by their category directory descending, and then by name ascending
  images = images.sort((a, b) => b.category.name.localeCompare(a.category.name) || a.file.localeCompare(b.file))

  eleventyConfig.addCollection('images', async () => images)

  eleventyConfig.addCollection('imagesByCategory', async () => {
    const categories: Category[] = []
    const grouped = _.chain(images)
      .groupBy((image) => image.category.name)
      .toPairs()
      .value()
      .sort()
      .reverse()
    for (const categoryArray of grouped) {
      categories.push({
        name: categoryArray[0],
        slug: categoryArray[1][0]?.category.slug || '',
        title: categoryArray[1][0]?.category.title || '',
        description: categoryArray[1][0]?.category.description,
        images: categoryArray[1],
      })
    }
    return categories
  })

  // Include generated images files
  eleventyConfig.addPassthroughCopy('images-original')
  eleventyConfig.addPassthroughCopy(IMAGE_SIZES.small.dir)
  eleventyConfig.addPassthroughCopy(IMAGE_SIZES.medium.dir)
  eleventyConfig.addPassthroughCopy(IMAGE_SIZES.large.dir)

  // Makes the custom domain work on GH pages
  eleventyConfig.addPassthroughCopy('CNAME')

  // Styles :shrug:
  eleventyConfig.addPassthroughCopy('styles.css')
}
