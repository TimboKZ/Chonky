import { describe, expect, it, vi } from 'vitest'
import { formatHotkey, isFromTextEntry, matchesAnyHotkey, matchesHotkey } from './hotkeys'

const key = (init: Partial<KeyboardEvent> & { key: string }) =>
  ({ ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...init }) as KeyboardEvent

describe('matchesHotkey', () => {
  it('matches a plain key only when no modifier is held', () => {
    expect(matchesHotkey(key({ key: 'Delete' }), 'Delete')).toBe(true)
    expect(matchesHotkey(key({ key: 'Delete', shiftKey: true }), 'Delete')).toBe(false)
  })

  it('requires every listed modifier and rejects extras', () => {
    expect(matchesHotkey(key({ key: 'n', ctrlKey: true, shiftKey: true }), 'ctrl+shift+n')).toBe(true)
    expect(matchesHotkey(key({ key: 'n', ctrlKey: true }), 'ctrl+shift+n')).toBe(false)
    // An extra modifier means a different shortcut, not a looser match.
    expect(matchesHotkey(key({ key: 'c', ctrlKey: true, altKey: true }), 'ctrl+c')).toBe(false)
  })

  it('is case-insensitive on the key itself', () => {
    expect(matchesHotkey(key({ key: 'C', ctrlKey: true }), 'ctrl+c')).toBe(true)
  })
})

describe('matchesAnyHotkey', () => {
  it('accepts a list, and never matches an absent spec', () => {
    expect(matchesAnyHotkey(key({ key: 'Backspace' }), ['Delete', 'Backspace'])).toBe(true)
    expect(matchesAnyHotkey(key({ key: 'Delete' }), undefined)).toBe(false)
  })
})

describe('formatHotkey', () => {
  it('renders the first spec for display', () => {
    expect(formatHotkey(['ctrl+c', 'command+c'])).toMatch(/c$/i)
    expect(formatHotkey(undefined)).toBeUndefined()
  })
})

describe('isFromTextEntry', () => {
  // Stubbed targets rather than real DOM nodes: this suite runs in the node pool,
  // and the function only reads `tagName`, `isContentEditable`, and `closest`.
  it('recognises form fields, so hotkeys cannot fire while a name is being typed', () => {
    for (const tag of ['INPUT', 'TEXTAREA', 'SELECT']) {
      expect(isFromTextEntry({ tagName: tag, closest: () => null } as unknown as EventTarget)).toBe(true)
    }
  })

  it('recognises anything inside a dialog', () => {
    const target = { tagName: 'DIV', closest: vi.fn().mockReturnValue({}) } as unknown as EventTarget
    expect(isFromTextEntry(target)).toBe(true)
  })

  it('lets a plain listing element through', () => {
    const target = { tagName: 'DIV', closest: () => null } as unknown as EventTarget
    expect(isFromTextEntry(target)).toBe(false)
    expect(isFromTextEntry(null)).toBe(false)
  })
})
