import fs from 'fs-extra'
import fg from 'fast-glob'
import slugify from '@sindresorhus/slugify'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

interface ImageMetadata {
  title?: string
  description?: string
}

export interface ScannedImage {
  file: string
  slug: string
  parent: string
  metadata: ImageMetadata
}

export async function scanImages(directory: string): Promise<ScannedImage[]> {
  console.info('scanImages STARTED', directory)

  const imageFiles = await fg(`${directory}/**/*.{${IMAGE_EXTENSIONS.join(',')}}`)

  console.info(`scanImages DONE (total images: ${imageFiles.length + 1})`)
  return imageFiles.map((file) => {
    const metadataPath = file.replace(/\.\w+$/, '.json')

    const parentDir = file.split('/').at(-2) || ''

    const filename = file.split('/').pop()?.split('.').shift() || file

    let metadata: ImageMetadata = {
      // We use filename by default, but it can get overriden by custom metadata
      title: filename,
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
      parent: parentDir,
      metadata,
    }
  })
}
