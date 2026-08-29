import { useCallback, useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'

export interface DocxViewerProps {
  /** Raw DOCX file content as an ArrayBuffer */
  content: ArrayBuffer
  /** Whether dark mode is active */
  darkMode?: boolean
  /** Additional CSS class */
  className?: string
}

export function DocxViewer({ content, darkMode = false, className = '' }: DocxViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (!wrapperRef.current || !containerRef.current) return
    const wrapperWidth = wrapperRef.current.clientWidth
    const docSection = containerRef.current.querySelector('section')
    if (!docSection) return
    const docWidth = docSection.scrollWidth
    if (docWidth > 0) {
      setScale(Math.min(1, (wrapperWidth - 8) / docWidth))
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    setLoading(true)
    setError(undefined)
    containerRef.current.innerHTML = ''

    ;(async () => {
      try {
        await renderAsync(content, containerRef.current!, undefined, {
          className: 'docx-preview',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
        })
      } catch (e) {
        setError('Failed to render document.')
        console.error('DocxViewer error:', e)
      } finally {
        setLoading(false)
        requestAnimationFrame(updateScale)
      }
    })()
  }, [content, updateScale])

  useEffect(() => {
    if (!wrapperRef.current) return
    const observer = new ResizeObserver(updateScale)
    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [updateScale])

  return (
    <div ref={wrapperRef} className={`h-full overflow-auto relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-gray-400">Loading document...</div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <div
        ref={containerRef}
        className={darkMode ? 'docx-viewer-dark' : ''}
        style={{
          display: loading ? 'none' : 'block',
          zoom: scale,
          userSelect: 'text',
          cursor: 'text',
        }}
        onCopy={(e) => e.stopPropagation()}
      />
      <style>{`
        .docx-preview-wrapper {
          background: transparent !important;
          padding: 4px;
        }
        .docx-preview-wrapper section.docx {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
          background: white;
        }
        .docx-preview-wrapper * {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .docx-viewer-dark .docx-preview-wrapper section.docx {
          background: #1f2937;
          color: #e5e7eb;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
