import type { Density, SortDirection, SortKey, ViewMode } from './types'

export interface PersistedPreferences {
  viewMode?: ViewMode
  sortKey?: SortKey
  sortDirection?: SortDirection
  density?: Density
  showHidden?: boolean
}

const PREFIX = 'fsg-file-browser:'

/**
 * View preferences survive a reload but are per-browser, never authoritative:
 * every read is defensive because storage is unavailable in private windows,
 * sandboxed iframes, and browsers configured to block site data.
 */
export function readPreferences(key: string): PersistedPreferences {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as PersistedPreferences) : {}
  } catch {
    return {}
  }
}

export function writePreferences(key: string, preferences: PersistedPreferences): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(preferences))
  } catch {
    // Storage unavailable or full — preferences simply don't persist this session.
  }
}
