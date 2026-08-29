import { Component, Suspense, lazy, type ComponentType, type ErrorInfo, type ReactNode } from 'react'
import { FileWarning } from 'lucide-react'
import { Spinner } from '../ui/primitives/progress'

/**
 * Every viewer loads on demand.
 *
 * The heavy ones (three.js for STL, `xlsx`, `docx-preview`) are optional peers, so
 * an app that never previews a 3D model never downloads three — and one that
 * didn't install the peer gets the fallback below rather than a build error.
 */
const CsvViewerLazy = lazy(() => import('./viewers/csv-viewer').then((m) => ({ default: m.CsvViewer })))
const HtmlViewerLazy = lazy(() => import('./viewers/html-viewer').then((m) => ({ default: m.HtmlViewer })))
const EmlViewerLazy = lazy(() => import('./viewers/eml-viewer').then((m) => ({ default: m.EmlViewer })))
const StlViewerLazy = lazy(() => import('./viewers/stl-viewer').then((m) => ({ default: m.StlViewer })))
const XlsxViewerLazy = lazy(() => import('./viewers/xlsx-viewer').then((m) => ({ default: m.XlsxViewer })))
const DocxViewerLazy = lazy(() => import('./viewers/docx-viewer').then((m) => ({ default: m.DocxViewer })))

function ViewerFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  )
}

/**
 * Contains a viewer that fails to load or render.
 *
 * These viewers depend on optional peers, so "not installed" and "installed at a
 * major that doesn't match this app's React" are both reachable states — and a
 * chunk that throws on import rejects a lazy() promise, which React rethrows past
 * Suspense. Without this the whole preview panel unmounts, taking the file browser
 * with it, over a file type the user could simply have downloaded instead.
 */
class ViewerErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('A file viewer failed to render. Its optional peer dependency may be missing or incompatible.', error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
        <FileWarning className="size-8" />
        <p className="text-sm">This file type can’t be displayed here.</p>
        <p className="text-xs">Download it to open it in another application.</p>
      </div>
    )
  }
}

function withSuspense<P extends object>(Viewer: ComponentType<P>) {
  return function SuspendedViewer(props: P) {
    return (
      <ViewerErrorBoundary>
        <Suspense fallback={<ViewerFallback />}>
          <Viewer {...props} />
        </Suspense>
      </ViewerErrorBoundary>
    )
  }
}

export const CsvViewer = withSuspense(CsvViewerLazy)
export const HtmlViewer = withSuspense(HtmlViewerLazy)
export const EmlViewer = withSuspense(EmlViewerLazy)
export const StlViewer = withSuspense(StlViewerLazy)
export const XlsxViewer = withSuspense(XlsxViewerLazy)
export const DocxViewer = withSuspense(DocxViewerLazy)
