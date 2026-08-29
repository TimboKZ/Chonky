export { convertHeicBytesToJpeg, convertHeicFileToJpeg } from './heic'
export {
  IMAGE_SIZE_LIMIT,
  RESIZABLE_IMAGE_MIME_TYPES,
  RESOLUTION_PRESETS,
  estimateResizedBytes,
  needsOptimization,
  resizeImageFile,
} from './resize'
export type { ResolutionPreset } from './resize'
export { isCoarsePointerDevice, useImageOptimization } from './use-image-optimization'
export type {
  AutoOptimizePreset,
  ImageOptimizationMode,
  ImageOptimizationResult,
  UseImageOptimizationOptions,
} from './use-image-optimization'
export { ImageOptimizationDialog } from './optimization-dialog'
export type { ImageOptimizationDialogProps } from './optimization-dialog'
