import type { SharpenOptions, FormatEnum, OutputOptions, JpegOptions, GifOptions } from 'sharp'

// Sometimes we want to have no sharpening, so to make things easier (?) we have this zero sharpening options:
const SHARPEN_OPTIONS_NONE: SharpenOptions = { sigma: 1, m1: 0, m2: 0, x1: 0, y2: 0, y3: 0 }
const SHARPEN_OPTIONS_SOME: SharpenOptions = { sigma: 4, m1: 0.5, m2: 3, x1: 200, y2: 1, y3: 2 }

const FORMAT_OPTIONS_JPEG: JpegOptions = {
  quality: 80,
  // Progressive is better than baseline
  progressive: true,
  // Better compression, but slower
  mozjpeg: true,
}

const FORMAT_OPTIONS_GIF: GifOptions = {
  reuse: true,
  progressive: true,
  colors: 10,
  effort: 2,
  dither: 1,
}

enum ImageSizeName {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export interface ImageSizeDefinition {
  name: ImageSizeName
  dir: string
  width: number
  sharpenOptions: SharpenOptions
  format: keyof FormatEnum
  formatOptions: OutputOptions | JpegOptions
}

export const IMAGE_SIZES: Record<ImageSizeName, ImageSizeDefinition> = {
  small: {
    name: ImageSizeName.small,
    dir: 'images-small',
    width: 60,
    sharpenOptions: SHARPEN_OPTIONS_SOME,
    format: 'gif',
    formatOptions: FORMAT_OPTIONS_GIF,
  },
  medium: {
    name: ImageSizeName.medium,
    dir: 'images-medium',
    width: 320,
    sharpenOptions: SHARPEN_OPTIONS_SOME,
    format: 'gif',
    formatOptions: FORMAT_OPTIONS_GIF,
  },
  large: {
    name: ImageSizeName.large,
    dir: 'images-large',
    width: 1200,
    sharpenOptions: SHARPEN_OPTIONS_NONE,
    format: 'jpeg',
    formatOptions: FORMAT_OPTIONS_JPEG,
  },
}

export const DOMAIN_BASE_URL = 'https://drawings.zefirefemera.xyz/'
