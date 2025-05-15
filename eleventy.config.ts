import 'tsx/esm'
import _ from 'lodash'
import postcssPlugin from '@jgarber/eleventy-plugin-postcss'
import type UserConfig from './UserConfig.d.ts'
import { IMAGE_SIZES, DOMAIN_BASE_URL } from './constants.ts'
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

/**
 * Prefixes the given URL with the site's base URL.
*/
function toAbsoluteUrl(url: string) {
  const isDev = process.env.ELEVENTY_ENV === 'development'
  const baseUrl = isDev ? 'localhost:8080' : DOMAIN_BASE_URL
  return new URL(url, baseUrl).href
}

export default async function (eleventyConfig: UserConfig) {
  // This will ensure that `styles.css` are present in the final output :bow:
  eleventyConfig.addPlugin(postcssPlugin)

  eleventyConfig.setFrontMatterParsingOptions({ language: 'json' })

  eleventyConfig.addGlobalData('baseUrl', DOMAIN_BASE_URL)

  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl)

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
        medium: await generateMedium(image.file),
        large: await generateLarge(image.file),
      })
    }),
  )
  console.info('scan and generate images DONE')

  // Create collection of all images sorted by title
  const imagesByAbc = [...images]
  imagesByAbc.sort((a, b) => a.title.localeCompare(b.title))
  eleventyConfig.addCollection('imagesByAbc', async () => imagesByAbc)

  // Create collection of images grouped by category
  eleventyConfig.addCollection('imagesByCategory', async () => {
    // Create collection of images sorted by their category directory,
    // and then by file name
    images.sort((a, b) => a.category.name.localeCompare(b.category.name) || a.file.localeCompare(b.file))
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
        url: categoryArray[1][0]?.category.url || '',
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

  // Logo
  eleventyConfig.addPassthroughCopy('zefirefemera-logo-color.png')

  // Makes the custom domain work on GH pages
  eleventyConfig.addPassthroughCopy('CNAME')

  // Make sure fonts are copied :shrug:
  eleventyConfig.addPassthroughCopy('fonts')
}
