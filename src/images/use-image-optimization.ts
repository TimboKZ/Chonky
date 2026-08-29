import { useCallback, useRef, useState } from 'react'
import { RESOLUTION_PRESETS, needsOptimization, resizeImageFile, type ResolutionPreset } from './resize'
import { convertHeicFileToJpeg } from './heic'
import { isHeic } from '../util/mime'

export interface ImageOptimizationResult {
  files: File[]
  cancelled?: boolean
}

/**
 * How oversized images are handled on upload:
 * - `modal` — always ask through the wizard
 * - `auto` — silently resize with `autoPreset`
 * - `auto-mobile` — `auto` on coarse-pointer devices, `modal` elsewhere
 */
export type ImageOptimizationMode = 'modal' | 'auto' | 'auto-mobile'
export type AutoOptimizePreset = 'full-hd' | 'hd' | 'web'

const AUTO_PRESETS: Record<AutoOptimizePreset, ResolutionPreset> = {
  'full-hd': RESOLUTION_PRESETS[0],
  'hd': RESOLUTION_PRESETS[1],
  'web': RESOLUTION_PRESETS[2],
}

/** True where the primary pointer is coarse (phones, tablets). Touch laptops report
 * a fine primary pointer and so keep the wizard. */
export function isCoarsePointerDevice(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches
}

export interface UseImageOptimizationOptions {
  /** @default 'auto-mobile' */
  mode?: ImageOptimizationMode
  /** @default 'full-hd' */
  autoPreset?: AutoOptimizePreset
  /** Decode HEIC/HEIF to JPEG before optimizing. @default true */
  heic?: boolean
  /** Reports a HEIC file that could not be decoded and was uploaded unchanged. */
  onHeicFallback?: (names: string[]) => void
}

/**
 * The upload `transform` the FSG apps use: HEIC decode, then optional downscaling.
 *
 * Returns a `transform` to hand to `<FileBrowser transformUpload>` plus the state
 * the wizard dialog renders from.
 */
export function useImageOptimization(options?: UseImageOptimizationOptions) {
  const mode = options?.mode ?? 'auto-mobile'
  const autoPreset = options?.autoPreset ?? 'full-hd'
  const heicEnabled = options?.heic ?? true

  const [open, setOpen] = useState(false)
  const [oversizedFiles, setOversizedFiles] = useState<File[]>([])
  const allFilesRef = useRef<File[]>([])
  const resolveRef = useRef<((result: ImageOptimizationResult) => void) | null>(null)
  const onHeicFallbackRef = useRef(options?.onHeicFallback)
  onHeicFallbackRef.current = options?.onHeicFallback

  const transform = useCallback(
    async (files: File[]): Promise<ImageOptimizationResult> => {
      let working = files

      if (heicEnabled) {
        const fallbacks: string[] = []
        working = await Promise.all(
          working.map(async (file) => {
            if (!isHeic({ name: file.name, mimeType: file.type })) return file
            try {
              return await convertHeicFileToJpeg(file)
            } catch (e) {
              // A HEIC that won't decode is still the user's photo — upload the
              // original rather than dropping it, and say so afterwards.
              console.error('HEIC conversion failed — uploading the original:', file.name, e)
              fallbacks.push(file.name)
              return file
            }
          }),
        )
        if (fallbacks.length > 0) onHeicFallbackRef.current?.(fallbacks)
      }

      const oversized = working.filter(needsOptimization)
      if (oversized.length === 0) return { files: working }

      if (mode === 'auto' || (mode === 'auto-mobile' && isCoarsePointerDevice())) {
        const { maxDimension } = AUTO_PRESETS[autoPreset]
        const resized = await Promise.all(working.map((file) => (needsOptimization(file) ? resizeImageFile(file, maxDimension) : file)))
        return { files: resized }
      }

      allFilesRef.current = working
      setOversizedFiles(oversized)
      setOpen(true)

      return new Promise<ImageOptimizationResult>((resolve) => {
        resolveRef.current = resolve
      })
    },
    [mode, autoPreset, heicEnabled],
  )

  const confirm = useCallback(async (perFilePresets: Map<File, ResolutionPreset>) => {
    setOpen(false)
    const entries = [...perFilePresets.entries()]
    const resized = await Promise.all(entries.map(([file, preset]) => resizeImageFile(file, preset.maxDimension)))

    const replacements = new Map<File, File>()
    entries.forEach(([original], index) => replacements.set(original, resized[index]))

    resolveRef.current?.({ files: allFilesRef.current.map((file) => replacements.get(file) ?? file) })
    resolveRef.current = null
  }, [])

  const skip = useCallback(() => {
    setOpen(false)
    resolveRef.current?.({ files: allFilesRef.current })
    resolveRef.current = null
  }, [])

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    // Dismissing the wizard cancels the upload outright rather than silently
    // uploading full-size originals the user was in the middle of reviewing.
    if (!next && resolveRef.current) {
      resolveRef.current({ files: allFilesRef.current, cancelled: true })
      resolveRef.current = null
    }
  }, [])

  return { transform, open, oversizedFiles, confirm, skip, onOpenChange }
}
