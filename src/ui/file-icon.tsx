import {
  Archive,
  Code2,
  File as FileIcon,
  FileSpreadsheet,
  FileText,
  FileType,
  Folder,
  Image as ImageIcon,
  Mail,
  Music,
  Box,
  Presentation,
  Video,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '../util/cn'
import { getFileKind, type FileKind } from '../util/mime'

const ICONS: Record<FileKind, ComponentType<{ className?: string }>> = {
  folder: Folder,
  image: ImageIcon,
  video: Video,
  audio: Music,
  pdf: FileType,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  presentation: Presentation,
  archive: Archive,
  code: Code2,
  text: FileText,
  email: Mail,
  model: Box,
  unknown: FileIcon,
}

/* Kind colours come from the semantic token set, so they track the theme rather
 * than being hard-coded per palette. */
const COLORS: Record<FileKind, string> = {
  folder: 'text-primary',
  image: 'text-purple',
  video: 'text-purple',
  audio: 'text-purple',
  pdf: 'text-red',
  spreadsheet: 'text-green',
  document: 'text-blue',
  presentation: 'text-orange',
  archive: 'text-yellow',
  code: 'text-blue',
  text: 'text-muted-foreground',
  email: 'text-blue',
  model: 'text-orange',
  unknown: 'text-muted-foreground',
}

export interface FileIconProps {
  entry: { name?: string; mimeType?: string; isDir?: boolean }
  className?: string
  /** Folders render filled, which reads as a container rather than a document. */
  filled?: boolean
}

export function FileTypeIcon({ entry, className, filled = true }: FileIconProps) {
  const kind = getFileKind(entry)
  const Icon = ICONS[kind]
  return (
    <Icon
      aria-hidden
      className={cn(COLORS[kind], kind === 'folder' && filled && 'fill-current/20', className)}
    />
  )
}

export { getFileKind }
