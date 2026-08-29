import type { FileBrowserState } from './types'

type Listener = () => void
type Updater = (state: FileBrowserState) => Partial<FileBrowserState> | null

export interface Store {
  getState(): FileBrowserState
  /**
   * Applies a partial update. Returning `null` (or a patch whose every value is
   * already `Object.is`-equal) skips the notify entirely, so a no-op set can't
   * re-render the whole listing.
   */
  set(updater: Updater | Partial<FileBrowserState>): void
  subscribe(listener: Listener): () => void
}

export function createStore(initial: FileBrowserState): Store {
  let state = initial
  const listeners = new Set<Listener>()

  return {
    getState: () => state,

    set(updater) {
      const patch = typeof updater === 'function' ? updater(state) : updater
      if (!patch) return

      let changed = false
      for (const key of Object.keys(patch) as (keyof FileBrowserState)[]) {
        if (!Object.is(state[key], patch[key])) {
          changed = true
          break
        }
      }
      if (!changed) return

      state = { ...state, ...patch }
      // Copy before iterating: a listener may unsubscribe during the notify, and
      // mutating the live Set mid-iteration would skip the next listener.
      for (const listener of [...listeners]) listener()
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export function createInitialState(overrides?: Partial<FileBrowserState>): FileBrowserState {
  return {
    path: '',
    entries: [],
    folderChain: [],
    status: 'idle',
    error: null,
    selection: new Set<string>(),
    focusedId: null,
    anchorId: null,
    viewMode: 'grid',
    sortKey: 'name',
    sortDirection: 'asc',
    density: 'comfortable',
    showHidden: false,
    search: '',
    clipboard: null,
    uploads: [],
    ...overrides,
  }
}
