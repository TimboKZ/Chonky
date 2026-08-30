import { useEffect, useState, type RefObject } from 'react'

/**
 * An element's content width, tracked live.
 *
 * For the handful of places that need a container query's answer in JavaScript
 * rather than in CSS — deciding what a menu contains, say, rather than how it
 * looks. Starts at `Infinity` so a width-gated feature renders in its roomiest
 * form for one frame instead of flashing its cramped one.
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(Number.POSITIVE_INFINITY)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const measure = () => setWidth(element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return width
}
