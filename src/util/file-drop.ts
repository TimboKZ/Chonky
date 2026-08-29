import { isSystemFile } from './system-files'

export interface DroppedFile {
  file: File
  /** Path relative to the drop root, e.g. `photos/2024/a.jpg`. */
  relativePath: string
}

export interface DropTraversal {
  files: DroppedFile[]
  /** Relative paths of directories that hold nothing once system files are ignored. */
  emptyDirs: string[]
  /** Directories skipped because their contents could not be read. */
  unreadableDirs: string[]
  /**
   * Whether the browser exposed any webkit entries. The only condition under which
   * a caller should fall back to the flat `dataTransfer.files` list — gating on the
   * walk's *output* instead would let an entries-based drop that yielded nothing
   * (an unreadable folder, say) upload Chrome's 0-byte folder pseudo-file.
   */
  sawEntries: boolean
}

/** Drains a directory reader. `readEntries` returns at most 100 entries per call, so a
 * single read silently truncates any folder larger than that. */
function readAllEntries(reader: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const collected: any[] = []
    const readBatch = () =>
      reader.readEntries((entries: any[]) => {
        if (entries.length === 0) resolve(collected)
        else {
          collected.push(...entries)
          readBatch()
        }
      }, reject)
    readBatch()
  })
}

/**
 * Recursively walks a drag-and-drop `DataTransferItemList`, returning every
 * non-system file with its path relative to the drop root, plus the relative paths
 * of directories that end up empty.
 *
 * A directory that fails to read is skipped and reported rather than recorded as
 * empty — recreating it server-side would silently discard whatever it held.
 */
export async function traverseDroppedItems(items: DataTransferItem[]): Promise<DropTraversal> {
  const files: DroppedFile[] = []
  const emptyDirs: string[] = []
  const unreadableDirs: string[] = []

  const traverse = async (entry: any, path = ''): Promise<void> => {
    if (isSystemFile(entry.name)) return

    if (entry.isFile) {
      await new Promise<void>((resolve) => {
        entry.file(
          (file: File) => {
            files.push({ file, relativePath: path + file.name })
            resolve()
          },
          () => resolve(),
        )
      })
      return
    }

    if (entry.isDirectory) {
      let entries: any[]
      try {
        entries = await readAllEntries(entry.createReader())
      } catch (e) {
        console.warn('Skipping unreadable directory:', path + entry.name, e)
        unreadableDirs.push(path + entry.name)
        return
      }
      const survivors = entries.filter((child) => !isSystemFile(child.name))
      if (survivors.length === 0) {
        emptyDirs.push(path + entry.name)
        return
      }
      for (const child of survivors) {
        await traverse(child, `${path + entry.name}/`)
      }
    }
  }

  // webkitGetAsEntry() is synchronous, so this tells us whether the browser supports
  // the entries API at all — read before any await, since dataTransfer becomes
  // protected once the current task yields.
  const entries = items
    .filter((item) => item.kind === 'file')
    .map((item) => item.webkitGetAsEntry())
    .filter((entry): entry is FileSystemEntry => Boolean(entry))

  await Promise.all(entries.map((entry) => traverse(entry)))

  return { files, emptyDirs, unreadableDirs, sawEntries: entries.length > 0 }
}

/** User-facing warning for skipped directories, or null when nothing was skipped. */
export function unreadableDirsMessage(unreadableDirs: string[]): string | null {
  if (unreadableDirs.length === 0) return null
  if (unreadableDirs.length === 1) return `Couldn't read "${unreadableDirs[0]}" — it was skipped and not uploaded.`
  return `Couldn't read ${unreadableDirs.length} folders — they were skipped and not uploaded.`
}

/**
 * Attaches `webkitRelativePath` to each File via `defineProperty`, shadowing the
 * read-only prototype getter rather than copying bytes into a `new File(...)`.
 * Files not inside a directory get an empty path, matching `<input webkitdirectory>`.
 */
export function attachRelativePaths(dropped: DroppedFile[]): File[] {
  return dropped.map(({ file, relativePath }) => {
    const value = relativePath.includes('/') ? relativePath : ''
    try {
      Object.defineProperty(file, 'webkitRelativePath', { value, writable: false, enumerable: true, configurable: true })
    } catch {
      // Already defined as non-configurable on this File — keep the existing value.
    }
    return file
  })
}

/** Opens the OS file picker and resolves with the chosen files. */
export function pickFiles(options?: { directory?: boolean; accept?: string }): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.style.display = 'none'
    if (options?.directory) input.webkitdirectory = true
    if (options?.accept) input.accept = options.accept

    const cleanup = () => input.remove()
    input.addEventListener('cancel', () => {
      cleanup()
      resolve([])
    })
    input.onchange = () => {
      cleanup()
      resolve(Array.from(input.files ?? []).filter((file) => !isSystemFile(file.name)))
    }

    // iOS Safari only fires the picker for an input that is in the document.
    document.body.appendChild(input)
    input.click()
  })
}

export interface PickedDirectory {
  files: File[]
  emptyDirs: string[]
}

/**
 * Opens the OS directory picker.
 *
 * Prefers `showDirectoryPicker` (Chromium): walking a directory handle exposes
 * empty subdirectories, which an `<input webkitdirectory>` FileList silently drops.
 * Firefox and Safari fall back to the input, which cannot report empty directories.
 */
export async function pickDirectory(): Promise<PickedDirectory> {
  const picker = (window as any).showDirectoryPicker
  if (typeof picker !== 'function') {
    return { files: await pickFiles({ directory: true }), emptyDirs: [] }
  }

  let root: any
  try {
    root = await picker.call(window)
  } catch (e) {
    if ((e as DOMException)?.name === 'AbortError') return { files: [], emptyDirs: [] }
    // showDirectoryPicker consumes the click's user activation, so falling back to
    // input.click() here would be blocked by the browser without explanation.
    throw new Error('Could not open the folder picker. Try again, or drag the folder into the window.')
  }

  const dropped: DroppedFile[] = []
  const emptyDirs: string[] = []

  const walk = async (handle: any, path: string): Promise<void> => {
    let survivors = 0
    for await (const [name, child] of handle.entries()) {
      if (child.kind === 'file') {
        if (isSystemFile(name)) continue
        survivors++
        dropped.push({ file: await child.getFile(), relativePath: path + name })
      } else {
        survivors++
        await walk(child, `${path + name}/`)
      }
    }
    if (survivors === 0) emptyDirs.push(path.replace(/\/+$/, ''))
  }

  // Prefix with the root folder's own name so relative paths match the shape
  // produced by drag-and-drop and <input webkitdirectory>.
  await walk(root, `${root.name}/`)

  return { files: attachRelativePaths(dropped), emptyDirs }
}
