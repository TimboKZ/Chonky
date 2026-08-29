import { useEffect, useState } from 'react'

const QUERY = '(pointer: coarse)'

/**
 * True when the primary pointer is coarse — a finger rather than a mouse.
 *
 * Rows are positioned absolutely by the virtualizer at a height it is told in
 * advance, so a touch-sized row cannot come from a CSS `min-height`: the measured
 * height and the painted height would disagree and rows would overlap. The size
 * has to be decided in JS, which is what this is for.
 *
 * Reactive, because a Surface or an iPad with a trackpad attached can change
 * answer mid-session.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia(QUERY)
    const update = (event: MediaQueryListEvent) => setCoarse(event.matches)
    setCoarse(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return coarse
}
