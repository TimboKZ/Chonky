export const RESIZABLE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp']

/** Images above this are offered for downscaling on upload. */
export const IMAGE_SIZE_LIMIT = 2 * 1024 * 1024

export interface ResolutionPreset {
  label: string
  maxDimension: number
  description: string
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  { label: 'Full HD', maxDimension: 1920, description: 'Max 1920px on longest side' },
  { label: 'HD', maxDimension: 1280, description: 'Max 1280px on longest side' },
  { label: 'Web', maxDimension: 800, description: 'Max 800px on longest side' },
]

export function needsOptimization(file: File): boolean {
  return file.size > IMAGE_SIZE_LIMIT && RESIZABLE_IMAGE_MIME_TYPES.includes(file.type)
}

/**
 * Downscales an image so its longest side fits `maxDimension`.
 *
 * Returns the original file untouched when it is already small enough, or when
 * re-encoding produced something no smaller — a re-encode that grows the file is
 * strictly worse than uploading what the user picked.
 */
export async function resizeImageFile(file: File, maxDimension: number): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  if (width <= maxDimension && height <= maxDimension) {
    bitmap.close()
    return file
  }

  const scale = maxDimension / Math.max(width, height)
  const targetWidth = Math.round(width * scale)
  const targetHeight = Math.round(height * scale)

  const useOffscreen = typeof OffscreenCanvas !== 'undefined'
  const canvas: HTMLCanvasElement | OffscreenCanvas = useOffscreen
    ? new OffscreenCanvas(targetWidth, targetHeight)
    : Object.assign(document.createElement('canvas'), { width: targetWidth, height: targetHeight })

  const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  if (!context) {
    bitmap.close()
    return file
  }

  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => {
    if (canvas instanceof OffscreenCanvas) {
      canvas.convertToBlob({ type: file.type, quality: 0.92 }).then(resolve).catch(() => resolve(null))
    } else {
      canvas.toBlob(resolve, file.type, 0.92)
    }
  })

  if (!blob || blob.size >= file.size) return file

  const resized = new File([blob], file.name, { type: file.type, lastModified: file.lastModified })

  const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath
  if (relativePath) {
    Object.defineProperty(resized, 'webkitRelativePath', { value: relativePath, writable: false, enumerable: true, configurable: true })
  }
  return resized
}

/** Estimates the post-resize byte count, for the wizard's before/after figure. */
export function estimateResizedBytes(originalSize: number, width: number, height: number, maxDimension: number): number {
  const longest = Math.max(width, height)
  if (longest <= maxDimension) return originalSize
  const scale = maxDimension / longest
  return Math.round(originalSize * scale * scale)
}
