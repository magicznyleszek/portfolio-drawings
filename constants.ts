enum ImageSizeName {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export interface ImageSizeDefinition {
  name: ImageSizeName
  dir: string
  width: number
}

export const IMAGE_SIZES: Record<ImageSizeName, ImageSizeDefinition> = {
  small: {
    name: ImageSizeName.small,
    dir: 'images-small',
    width: 60,
  },
  medium: {
    name: ImageSizeName.medium,
    dir: 'images-medium',
    width: 320,
  },
  large: {
    name: ImageSizeName.large,
    dir: 'images-large',
    width: 1200,
  },
}
