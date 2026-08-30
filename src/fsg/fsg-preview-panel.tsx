import { useMemo } from 'react'
import { FilePreviewPanel as CorePreviewPanel } from '../preview/preview-panel'
import { createFsgAdapter } from '../adapter/fsg/fsg-adapter'
import { fileItemToEntry } from './converters'
import { cn } from '../util/cn'
import type { FsgRequestFn } from '../adapter/fsg/request'
import type { FileBrowserApiConfig, FileItem } from './types'

export interface FsgPreviewPanelProps {
  file: FileItem | undefined
  apiConfig: FileBrowserApiConfig
  /** Reuse an app's own fetch wrapper (auth headers, tracing, retries). */
  request?: FsgRequestFn
  /** Shows a Back affordance instead of a close button. */
  previewPage?: boolean
  onBack?: () => void
  className?: string
}

/**
 * Preview panel for a single FSG file, usable on its own — beside an attachment
 * list, or on a dedicated preview page — rather than inside a file browser.
 */
export function FsgPreviewPanel({ file, apiConfig, request, previewPage, onBack, className }: FsgPreviewPanelProps) {
  const adapter = useMemo(
    () => createFsgAdapter({ baseUrl: apiConfig.baseUrl, area: apiConfig.area, request }),
    [apiConfig.baseUrl, apiConfig.area, request],
  )
  const entry = useMemo(() => (file ? fileItemToEntry(file) : null), [file])

  return (
    <CorePreviewPanel
      entry={entry}
      adapter={adapter}
      // Standalone, the panel always sits in a container that owns its size and its
      // chrome, so it fills its box and draws no border of its own.
      className={cn('h-full w-full', className)}
      onClose={previewPage ? onBack : undefined}
    />
  )
}
