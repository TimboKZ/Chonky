import { describe, expect, it } from 'vitest'
import { pruneSelection, resolveSelection, selectedEntries } from './selection'
import type { FileEntry } from './types'

const entry = (id: string, isDir = false): FileEntry => ({ id, name: id, isDir })
const visible = [entry('a'), entry('b'), entry('c'), entry('d'), entry('e')]

const resolve = (overrides: Partial<Parameters<typeof resolveSelection>[0]>) =>
  resolveSelection({
    visible,
    selection: new Set<string>(),
    anchorId: null,
    targetId: 'a',
    toggle: false,
    range: false,
    ...overrides,
  })

describe('resolveSelection', () => {
  it('replaces the selection on a plain click and moves the anchor', () => {
    const result = resolve({ selection: new Set(['a', 'b']), anchorId: 'a', targetId: 'd' })
    expect([...result.selection]).toEqual(['d'])
    expect(result.anchorId).toBe('d')
    expect(result.focusedId).toBe('d')
  })

  it('adds and removes a single entry on toggle, without disturbing the rest', () => {
    const added = resolve({ selection: new Set(['a']), targetId: 'c', toggle: true })
    expect([...added.selection].sort()).toEqual(['a', 'c'])

    const removed = resolve({ selection: new Set(['a', 'c']), targetId: 'c', toggle: true })
    expect([...removed.selection]).toEqual(['a'])
  })

  it('selects the inclusive range between anchor and target, in either direction', () => {
    const forward = resolve({ anchorId: 'b', targetId: 'd', range: true })
    expect([...forward.selection].sort()).toEqual(['b', 'c', 'd'])

    const backward = resolve({ anchorId: 'd', targetId: 'b', range: true })
    expect([...backward.selection].sort()).toEqual(['b', 'c', 'd'])
  })

  it('leaves the anchor put through a range, so the next shift-click re-measures from it', () => {
    const first = resolve({ anchorId: 'b', targetId: 'd', range: true })
    expect(first.anchorId).toBe('b')

    const shrunk = resolve({ selection: first.selection, anchorId: first.anchorId, targetId: 'c', range: true })
    expect([...shrunk.selection].sort()).toEqual(['b', 'c'])
  })

  it('unions the range onto the existing selection when toggle is held too', () => {
    const result = resolve({ selection: new Set(['a']), anchorId: 'c', targetId: 'd', range: true, toggle: true })
    expect([...result.selection].sort()).toEqual(['a', 'c', 'd'])
  })

  it('degrades a range with no anchor to a plain select rather than selecting nothing', () => {
    const result = resolve({ anchorId: null, targetId: 'c', range: true })
    expect([...result.selection]).toEqual(['c'])
    expect(result.anchorId).toBe('c')
  })

  it('degrades to a plain select when the anchor is no longer visible', () => {
    // A folder refresh (or a search) can drop the anchored entry out of the list.
    const result = resolve({ anchorId: 'gone', targetId: 'c', range: true })
    expect([...result.selection]).toEqual(['c'])
  })
})

describe('pruneSelection', () => {
  it('drops ids that are no longer present, so a refresh cannot strand a phantom', () => {
    const pruned = pruneSelection(new Set(['a', 'zz']), visible)
    expect([...pruned]).toEqual(['a'])
  })
})

describe('selectedEntries', () => {
  it('returns entries in display order, not the order they were clicked', () => {
    const selection = new Set(['d', 'a', 'c'])
    expect(selectedEntries(visible, selection).map((item) => item.id)).toEqual(['a', 'c', 'd'])
  })
})
