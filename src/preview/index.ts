export { FilePreviewPanel } from './preview-panel'
export type { FilePreviewPanelProps } from './preview-panel'
export { FileViewerDialog } from './viewer-dialog'
export type { FileViewerDialogProps } from './viewer-dialog'
export { getPreviewStrategy, isPreviewable } from './registry'
export type { PreviewStrategy } from './registry'
export { useEntryContent } from './use-entry-content'
export type { EntryContent } from './use-entry-content'

/*
 * Viewers are exported from `lazy-viewers`, not from their own modules.
 *
 * A static re-export here would put every viewer in this entry's chunk, and rollup
 * would then resolve the browser's dynamic import()s to that same chunk — so
 * previewing a CSV would download three.js, `xlsx`, and `docx-preview` along with
 * it. Going through the lazy barrel keeps one chunk per viewer.
 *
 * Each export below is already wrapped in Suspense, so it can be rendered directly.
 */
export { CsvViewer, DocxViewer, EmlViewer, HtmlViewer, StlViewer, XlsxViewer } from './lazy-viewers'
export type { CsvViewerProps } from './viewers/csv-viewer'
export type { EmlViewerProps } from './viewers/eml-viewer'
export type { HtmlViewerProps } from './viewers/html-viewer'
export type { StlViewerProps } from './viewers/stl-viewer'
export type { XlsxViewerProps } from './viewers/xlsx-viewer'
export type { DocxViewerProps } from './viewers/docx-viewer'
export { parseEmlContent } from './viewers/lib/parse-eml'
