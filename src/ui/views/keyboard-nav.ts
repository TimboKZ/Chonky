import type { KeyboardEvent } from 'react'

export interface NavigationOptions {
  /** Entries currently rendered, in display order. */
  count: number
  /** Index the keyboard is on. */
  focusedIndex: number
  /** Tiles per row. 1 for the list and details views. */
  columns: number
}

/**
 * Maps an arrow/Home/End keypress onto the index it should move focus to, or null
 * when the key isn't a navigation key.
 *
 * Movement clamps at the ends rather than wrapping: wrapping from the last row back
 * to the first makes it easy to overshoot a long listing without noticing.
 */
export function nextIndexForKey(key: string, { count, focusedIndex, columns }: NavigationOptions): number | null {
  if (count === 0) return null
  const current = focusedIndex < 0 ? 0 : focusedIndex
  const clamp = (index: number) => Math.max(0, Math.min(count - 1, index))

  switch (key) {
    case 'ArrowRight':
      return clamp(current + 1)
    case 'ArrowLeft':
      return clamp(current - 1)
    case 'ArrowDown':
      return clamp(current + columns)
    case 'ArrowUp':
      return clamp(current - columns)
    case 'Home':
      return 0
    case 'End':
      return count - 1
    case 'PageDown':
      return clamp(current + columns * 5)
    case 'PageUp':
      return clamp(current - columns * 5)
    default:
      return null
  }
}

export function isNavigationKey(event: KeyboardEvent): boolean {
  return ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)
}
