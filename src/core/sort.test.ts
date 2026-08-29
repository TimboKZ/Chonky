import { describe, expect, it } from 'vitest'
import { filterEntries, filterHidden, sortEntries, visibleEntries } from './sort'
import type { FileEntry } from './types'

const file = (name: string, extras: Partial<FileEntry> = {}): FileEntry => ({ id: name, name, isDir: false, ...extras })
const dir = (name: string, extras: Partial<FileEntry> = {}): FileEntry => ({ id: name, name, isDir: true, ...extras })

describe('sortEntries', () => {
  it('keeps directories first in both directions', () => {
    const entries = [file('b.txt'), dir('zeta'), file('a.txt'), dir('alpha')]

    expect(sortEntries(entries, 'name', 'asc').map((e) => e.name)).toEqual(['alpha', 'zeta', 'a.txt', 'b.txt'])
    // Descending reverses within each group but must not bury the folders.
    expect(sortEntries(entries, 'name', 'desc').map((e) => e.name)).toEqual(['zeta', 'alpha', 'b.txt', 'a.txt'])
  })

  it('sorts names the way a person reads numbers', () => {
    const entries = [file('img10.png'), file('img2.png'), file('img1.png')]
    expect(sortEntries(entries, 'name', 'asc').map((e) => e.name)).toEqual(['img1.png', 'img2.png', 'img10.png'])
  })

  it('falls back to name so equal rows keep a stable order', () => {
    const entries = [file('b.txt', { size: 10 }), file('a.txt', { size: 10 }), file('c.txt', { size: 10 })]
    expect(sortEntries(entries, 'size', 'asc').map((e) => e.name)).toEqual(['a.txt', 'b.txt', 'c.txt'])
  })

  it('does not mutate the array it was given', () => {
    const entries = [file('b.txt'), file('a.txt')]
    sortEntries(entries, 'name', 'asc')
    expect(entries.map((e) => e.name)).toEqual(['b.txt', 'a.txt'])
  })

  it('orders by size and modified date', () => {
    const bySize = sortEntries([file('big', { size: 900 }), file('small', { size: 10 })], 'size', 'asc')
    expect(bySize.map((e) => e.name)).toEqual(['small', 'big'])

    const byDate = sortEntries([file('new', { modifiedAt: 200 }), file('old', { modifiedAt: 100 })], 'modifiedAt', 'asc')
    expect(byDate.map((e) => e.name)).toEqual(['old', 'new'])
  })
})

describe('filterEntries', () => {
  it('matches case-insensitively anywhere in the name', () => {
    const entries = [file('Report Q1.pdf'), file('notes.txt')]
    expect(filterEntries(entries, 'q1').map((e) => e.name)).toEqual(['Report Q1.pdf'])
    expect(filterEntries(entries, '  ').map((e) => e.name)).toEqual(['Report Q1.pdf', 'notes.txt'])
  })
})

describe('filterHidden', () => {
  it('hides dotfiles unless asked for', () => {
    const entries = [file('.env'), file('index.ts')]
    expect(filterHidden(entries, false).map((e) => e.name)).toEqual(['index.ts'])
    expect(filterHidden(entries, true)).toHaveLength(2)
  })
})

describe('visibleEntries', () => {
  it('applies hidden, then search, then sort', () => {
    const entries = [file('.secret-report.txt'), file('Report B.pdf'), dir('Reports'), file('Report A.pdf')]
    const result = visibleEntries(entries, { search: 'report', showHidden: false, sortKey: 'name', sortDirection: 'asc' })
    expect(result.map((e) => e.name)).toEqual(['Reports', 'Report A.pdf', 'Report B.pdf'])
  })
})
