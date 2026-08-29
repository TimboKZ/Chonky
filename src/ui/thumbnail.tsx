import { useEffect, useRef, useState } from 'react'
import { cn } from '../util/cn'
import { FileTypeIcon } from './file-icon'
import type { FileEntry } from '../core/types'

/** Shared across every thumbnail so a folder revisited in one session doesn't refetch
 * images the browser has already decided are broken. */
const failedUrls = new Set<string>()

export interface ThumbnailProps {
  entry: FileEntry
  className?: string
  iconClassName?: string
}

/**
 * Renders the backend's thumbnail when there is one, falling back to the type icon.
 *
 * The image is only mounted once the tile is near the viewport: a folder of 500
 * photos would otherwise fire 500 requests on mount, and virtualization alone
 * doesn't help because the grid renders a generous overscan.
 */
export function Thumbnail({ entry, className, iconClassName }: ThumbnailProps) {
  const url = entry.thumbnailUrl
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(() => (url ? failedUrls.has(url) : false))

  useEffect(() => {
    if (!url || failed || visible) return
    const element = containerRef.current
    if (!element) return

    // No IntersectionObserver (jsdom, very old browsers) — load eagerly rather than
    // never showing a thumbnail at all.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((observed) => observed.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [url, failed, visible])

  const showImage = url && !failed

  return (
    <div ref={containerRef} className={cn('relative flex items-center justify-center overflow-hidden', className)}>
      {showImage && visible && (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            failedUrls.add(url)
            setFailed(true)
          }}
          className={cn('h-full w-full object-cover transition-opacity duration-200', loaded ? 'opacity-100' : 'opacity-0')}
        />
      )}
      {(!showImage || !loaded) && <FileTypeIcon entry={entry} className={cn('absolute', iconClassName)} />}
    </div>
  )
}
