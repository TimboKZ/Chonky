/**
 * Chonky 2.x compatibility layer.
 *
 * Transitional: it exists so an app can swap `chonky` for `@fsg/file-browser`
 * without rewriting its file-browser code, then migrate to the adapter API
 * incrementally. New code should import from `@fsg/file-browser` directly.
 *
 * See MIGRATION.md for the mapping, and for what this layer deliberately does not
 * reproduce.
 */
export { FullFileBrowser, setChonkyDefaults } from './full-file-browser'
export type { FullFileBrowserCompatProps } from './full-file-browser'
export { ChonkyActions, FileHelper, defineFileAction } from './actions'
export { ChonkyIconName } from './icons'
export type { ChonkyIconNameValue } from './icons'
export type {
  ChonkyFileAction as FileAction,
  ChonkyFileActionData as FileActionData,
  ChonkyFileActionHandler as FileActionHandler,
  ChonkyFileArray as FileArray,
  ChonkyFileData as FileData,
  ChonkyFileFilter as FileFilter,
} from './types'

/** Chonky exported `FullFileBrowser` under this name too. */
export { FullFileBrowser as FileBrowser } from './full-file-browser'
