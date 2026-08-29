/**
 * HEIC/HEIF → JPEG decoding.
 *
 * `libheif-js/wasm-bundle` is an optional peer reached only through a dynamic
 * import, so the ~1.4 MB WASM bundle is downloaded the first time a HEIC file is
 * actually encountered and never by an app that has none.
 *
 * Downscaling and recompression are deliberately not done here — the browser feeds
 * the decoded JPEG into the image-optimization pass, so this module only decodes.
 */

/** Concurrency cap: libheif holds the full raw bitmap in WASM memory (~70 MB for a
 * 24 MP photo), and decoding many at once exhausts mobile browser heaps. */
const CONCURRENCY = 2
let inFlight = 0
const queue: Array<() => void> = []

async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (inFlight >= CONCURRENCY) {
    await new Promise<void>((resolve) => queue.push(resolve))
  }
  inFlight++
  try {
    return await fn()
  } finally {
    inFlight--
    queue.shift()?.()
  }
}

type LibheifImage = {
  get_width: () => number
  get_height: () => number
  display: (imageData: ImageData, cb: (result: ImageData | null) => void) => void
}
type LibheifModule = { HeifDecoder: new () => { decode: (bytes: Uint8Array) => LibheifImage[] } }

let libheif: LibheifModule | null = null

async function loadLibheif(): Promise<LibheifModule> {
  if (libheif) return libheif
  try {
    // The wasm-bundle entry pre-embeds the binary, so there is no second fetch.
    const module = await import(/* @vite-ignore */ 'libheif-js/wasm-bundle')
    libheif = ((module as { default?: LibheifModule }).default ?? module) as LibheifModule
    return libheif
  } catch (error) {
    console.error('Failed to load the libheif-js decoder:', error)
    throw new Error('HEIC decoder failed to load. Install the optional `libheif-js` peer dependency to enable HEIC support.')
  }
}

async function decodeToJpeg(blob: Blob, quality: number): Promise<Blob> {
  const module = await loadLibheif()
  const bytes = new Uint8Array(await blob.arrayBuffer())

  const images = new module.HeifDecoder().decode(bytes)
  if (!images || images.length === 0) throw new Error('libheif: no images decoded from the HEIC container')

  // Index 0 is the primary image, as selected by the container's `pitm` box. For
  // multi-image containers — live photos, bursts, HDR gain maps — that is the SDR
  // image the user thinks of as the photo; auxiliary images are skipped.
  const image = images[0]
  const width = image.get_width()
  const height = image.get_height()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas 2D context unavailable')

  const imageData = context.createImageData(width, height)
  await new Promise<void>((resolve, reject) => {
    image.display(imageData, (result) => (result ? resolve() : reject(new Error('libheif: HEIF processing error'))))
  })

  context.putImageData(imageData, 0, 0)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((out) => (out ? resolve(out) : reject(new Error('canvas.toBlob produced no output'))), 'image/jpeg', quality)
  })
}

const swapExtension = (name: string) => name.replace(/\.(heic|heif)$/i, '.jpg')

/** Decodes HEIC bytes to JPEG bytes, for callers that already hold the raw file. */
export async function convertHeicBytesToJpeg(bytes: Uint8Array, quality = 0.95): Promise<Uint8Array> {
  return withSlot(async () => {
    const blob = await decodeToJpeg(new Blob([bytes as BlobPart], { type: 'image/heic' }), quality)
    return new Uint8Array(await blob.arrayBuffer())
  })
}

/**
 * Decodes a HEIC/HEIF `File` into a full-resolution JPEG `File`. Non-HEIC files are
 * returned untouched. Throws when the file can't be decoded — callers should fall
 * back to uploading the original and warn the user.
 */
export async function convertHeicFileToJpeg(file: File, quality = 0.95): Promise<File> {
  const { isHeic } = await import('../util/mime')
  if (!isHeic({ name: file.name, mimeType: file.type })) return file

  return withSlot(async () => {
    const blob = await decodeToJpeg(file, quality)
    const jpeg = new File([blob], swapExtension(file.name), { type: 'image/jpeg', lastModified: file.lastModified })

    // Preserve directory uploads: the relative path's extension has to change too,
    // or the file lands beside a folder entry that no longer matches it.
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath
    if (relativePath) {
      Object.defineProperty(jpeg, 'webkitRelativePath', {
        value: swapExtension(relativePath),
        writable: false,
        enumerable: true,
        configurable: true,
      })
    }
    return jpeg
  })
}
