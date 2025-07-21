import slugify from '@sindresorhus/slugify'
import fg from 'fast-glob'
import fs from 'fs-extra'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

export interface ScannedImageCategory {
  name: string
  slug: string
  url: string
  title: string
  description?: string
}

export interface ScannedImage {
  file: string
  slug: string
  url: string
  title: string
  description?: string
  isNsfw: boolean
  category: ScannedImageCategory
}

export async function scanImages(directory: string): Promise<ScannedImage[]> {
  console.info('scanImages STARTED', directory)

  const imageFiles = await fg(`${directory}/**/*.{${IMAGE_EXTENSIONS.join(',')}}`)

  console.info(`scanImages DONE (total images: ${imageFiles.length + 1})`)
  return imageFiles.map((file) => {
    // Step 1 - build category info
    // ============================

    const categoryDir = file.split('/').at(-2) || ''
    // We use directory name by default, but it can get overriden by custom metadata
    let categoryTitle = categoryDir
    let categoryDescription: string | undefined

    // Read optional metadata for category
    const categoryMetadataPath = `${directory}/${categoryDir}/_metadata.json`
    if (fs.existsSync(categoryMetadataPath)) {
      const categoryJsonMetadata = JSON.parse(fs.readFileSync(categoryMetadataPath, 'utf-8'))
      if (categoryJsonMetadata) {
        console.info('scanImages category metadata JSON found', categoryMetadataPath)
      }
      if (categoryJsonMetadata.title) {
        categoryTitle = categoryJsonMetadata.title
      }
      if (categoryJsonMetadata.description) {
        categoryDescription = categoryJsonMetadata.description
      }
    }

    const categorySlug = slugify(categoryDir)
    const categoryUrl = `/${categorySlug}/`

    // Step 2 - build image info
    // ============================

    const imageFilename = file.split('/').pop()?.split('.').shift() || file
    const imageMetadataPath = file.replace(/\.\w+$/, '.json')

    // We use filename by default, but it can get overriden by custom metadata
    let imageTitle = imageFilename
    let imageDescription: string | undefined

    // Read optional metadata for the image
    if (fs.existsSync(imageMetadataPath)) {
      const imageJsonMetadata = JSON.parse(fs.readFileSync(imageMetadataPath, 'utf-8'))
      if (imageJsonMetadata) {
        console.info('scanImages image metadata JSON found', imageMetadataPath)
      }
      if (imageJsonMetadata.title) {
        imageTitle = imageJsonMetadata.title
      }
      if (imageJsonMetadata.description) {
        imageDescription = imageJsonMetadata.description
      }
    }

    const imageSlug = slugify(imageFilename)
    const imageUrl = `/${categorySlug}/${imageSlug}/`

    // All NSFW images should have "nsfw" in the name, the rest of the keywords is here just for safety.
    const nsfwKeywords = ['nsfw', 'nude', 'porn', 'xconfessions', 'cheex', 'fourchambers']
    const isNsfw = nsfwKeywords.some((keyword) => imageFilename.toLocaleLowerCase().includes(keyword))

    return {
      file,
      slug: imageSlug,
      url: imageUrl,
      title: imageTitle,
      description: imageDescription,
      isNsfw: isNsfw,
      category: {
        name: categoryDir,
        slug: categorySlug,
        url: categoryUrl,
        title: categoryTitle,
        description: categoryDescription,
      },
    }
  })
}
