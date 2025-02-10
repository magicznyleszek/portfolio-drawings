import slugify from '@sindresorhus/slugify'
import fg from 'fast-glob'
import fs from 'fs-extra'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

export interface ScannedImageCategory {
  name: string
  slug: string
  title: string
  description?: string
}

export interface ScannedImage {
  file: string
  slug: string
  title: string
  description?: string
  /** Date string in ISO format */
  dateModified: string
  category: ScannedImageCategory
}

export async function scanImages(directory: string): Promise<ScannedImage[]> {
  console.info('scanImages STARTED', directory)

  const imageFiles = await fg(`${directory}/**/*.{${IMAGE_EXTENSIONS.join(',')}}`)

  console.info(`scanImages DONE (total images: ${imageFiles.length + 1})`)
  return imageFiles.map((file) => {
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

    return {
      file,
      slug: slugify(imageFilename),
      title: imageTitle,
      description: imageDescription,
      // Useful for sitemap
      dateModified: fs.statSync(file).mtime.toISOString(),
      category: {
        name: categoryDir,
        slug: slugify(categoryDir),
        title: categoryTitle,
        description: categoryDescription,
      },
    }
  })
}
