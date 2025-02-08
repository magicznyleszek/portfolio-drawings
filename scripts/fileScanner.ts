import slugify from '@sindresorhus/slugify'
import fg from 'fast-glob'
import fs from 'fs-extra'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

interface ImageMetadata {
  title?: string
  description?: string
  /** Date string in ISO format */
  date: string
}

export interface ScannedImage {
  file: string
  slug: string
  category: string
  categorySlug: string
  metadata: ImageMetadata
}

export async function scanImages(directory: string): Promise<ScannedImage[]> {
  console.info('scanImages STARTED', directory)

  const imageFiles = await fg(`${directory}/**/*.{${IMAGE_EXTENSIONS.join(',')}}`)

  console.info(`scanImages DONE (total images: ${imageFiles.length + 1})`)
  return imageFiles.map((file) => {
    const metadataPath = file.replace(/\.\w+$/, '.json')

    const categoryDir = file.split('/').at(-2) || ''

    const filename = file.split('/').pop()?.split('.').shift() || file

    let metadata: ImageMetadata = {
      // We use filename by default, but it can get overriden by custom metadata
      title: filename,
      date: fs.statSync(file).mtime.toISOString(),
    }
    if (fs.existsSync(metadataPath)) {
      const jsonMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      if (jsonMetadata) {
        metadata = {
          ...metadata,
          ...jsonMetadata,
        }
      }
    }

    return {
      file,
      slug: slugify(filename),
      category: categoryDir,
      categorySlug: slugify(categoryDir),
      metadata,
    }
  })
}
