import { cn } from '../util/cn'
import { splitFileName } from '../util/names'
import { useFileBrowserContext } from '../core/context'
import { TruncatedName } from './truncated-name'
import { ExtensionBadge } from './extension-badge'
import type { FileEntry } from '../core/types'

export interface EntryNameProps {
  entry: FileEntry
  className?: string
}

/**
 * An entry's name as the row views render it: the stem, middle-truncated, with the
 * extension held apart so truncation can never eat it.
 *
 * Directories are never split — a folder called `2024.backup` is not a `.backup`
 * file — and `extensionDisplay: 'inline'` opts the whole thing out.
 */
export function EntryName({ entry, className }: EntryNameProps) {
  const { extensionDisplay } = useFileBrowserContext()

  const separate = extensionDisplay === 'badge' && !entry.isDir
  const { stem, extension } = separate ? splitFileName(entry.name) : { stem: entry.name, extension: '' }

  return (
    <span className={cn('flex min-w-0 items-center gap-1.5', className)}>
      <TruncatedName name={stem} className="min-w-0 flex-1" />
      {extension && <ExtensionBadge extension={extension} />}
    </span>
  )
}
