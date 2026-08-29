import { describe, expect, it, vi } from 'vitest'
import { createInitialState, createStore } from './store'

describe('createStore', () => {
  it('notifies subscribers when a value actually changes', () => {
    const store = createStore(createInitialState())
    const listener = vi.fn()
    store.subscribe(listener)

    store.set({ path: 'documents' })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getState().path).toBe('documents')
  })

  it('skips the notify when nothing changed, so a no-op set cannot re-render the listing', () => {
    const store = createStore(createInitialState({ path: 'documents' }))
    const listener = vi.fn()
    store.subscribe(listener)

    store.set({ path: 'documents' })
    store.set(() => null)

    expect(listener).not.toHaveBeenCalled()
  })

  it('replaces state rather than mutating it, so useSyncExternalStore sees a new snapshot', () => {
    const store = createStore(createInitialState())
    const before = store.getState()

    store.set({ status: 'loading' })

    expect(store.getState()).not.toBe(before)
    expect(before.status).toBe('idle')
  })

  it('passes the current state to an updater function', () => {
    const store = createStore(createInitialState({ viewMode: 'grid' }))
    store.set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' }))
    expect(store.getState().viewMode).toBe('list')
  })

  it('survives a listener unsubscribing mid-notify', () => {
    const store = createStore(createInitialState())
    const second = vi.fn()
    const unsubscribeFirst = store.subscribe(() => unsubscribeFirst())
    store.subscribe(second)

    store.set({ path: 'a' })

    // Iterating the live Set would have skipped `second` when the first removed itself.
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('stops notifying after unsubscribe', () => {
    const store = createStore(createInitialState())
    const listener = vi.fn()
    store.subscribe(listener)()

    store.set({ path: 'a' })

    expect(listener).not.toHaveBeenCalled()
  })
})
