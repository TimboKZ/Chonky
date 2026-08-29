import { Suspense, lazy, type ComponentType } from 'react'
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

function withSuspense<P extends object>(Component: ComponentType<P>) {
  return function SuspendedViewer(props: P) {
    return (
      <Suspense fallback={<ViewerFallback />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export const CsvViewer = withSuspense(CsvViewerLazy)
export const HtmlViewer = withSuspense(HtmlViewerLazy)
export const EmlViewer = withSuspense(EmlViewerLazy)
export const StlViewer = withSuspense(StlViewerLazy)
export const XlsxViewer = withSuspense(XlsxViewerLazy)
export const DocxViewer = withSuspense(DocxViewerLazy)
