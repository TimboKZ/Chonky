const SYSTEM_FILE_NAMES = new Set([
  '.DS_Store',
  '._.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  '.localized',
  '.fseventsd',
  '.Spotlight-V100',
  '.Trashes',
  '.TemporaryItems',
  '.VolumeIcon.icns',
  '.com.apple.timemachine.donotpresent',
  '.AppleDouble',
  '.LSOverride',
  '.DocumentRevisions-V100',
  '.PKInstallSandboxManager',
  '.PKInstallSandboxManager-SystemSoftware',
])

/**
 * OS bookkeeping files that should never be uploaded. Matched by name at every
 * level of a directory walk, so a folder containing only a `.DS_Store` still
 * counts as empty.
 */
export function isSystemFile(fileName: string): boolean {
  if (SYSTEM_FILE_NAMES.has(fileName)) return true
  return (
    fileName.startsWith('._') ||
    fileName.startsWith('.fseventsd') ||
    fileName.startsWith('.Spotlight-') ||
    fileName.endsWith('.tmp') ||
    fileName.endsWith('.temp')
  )
}
