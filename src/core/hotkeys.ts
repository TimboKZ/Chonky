/**
 * Minimal hotkey matching. Chonky pulled in `hotkeys-js` for this; the browser
 * needs only "does this KeyboardEvent match this spec", which is a few lines and
 * avoids a global keymap that fights with the host app's own shortcuts.
 *
 * Spec grammar: `mod+shift+n`, `ctrl+c`, `Delete`, `ArrowDown`.
 * `mod` is ⌘ on macOS and Ctrl elsewhere, matching what users expect per platform.
 */

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '')

/**
 * Whether a right-click is asking for the browser's own menu instead of ours.
 *
 * ⌘ on macOS, Ctrl elsewhere — the same `mod` key the hotkeys use. Deliberately
 * not Ctrl on macOS: Ctrl+click *is* the secondary click there, so treating it as
 * the modifier would hand every Mac user who clicks that way the native menu and
 * never ours.
 *
 * Nothing in the UI advertises this. It exists so a developer can reach Inspect
 * over a listing that has covered every row in its own menu.
 */
export function wantsNativeContextMenu(event: { metaKey: boolean; ctrlKey: boolean }): boolean {
  return isMac ? event.metaKey : event.ctrlKey
}

export function matchesHotkey(event: KeyboardEvent, spec: string): boolean {
  const parts = spec.toLowerCase().split('+').map((part) => part.trim())
  const key = parts[parts.length - 1]
  const modifiers = new Set(parts.slice(0, -1))

  const wantMod = modifiers.has('mod')
  const wantCtrl = modifiers.has('ctrl') || (wantMod && !isMac)
  const wantMeta = modifiers.has('cmd') || modifiers.has('meta') || (wantMod && isMac)
  const wantShift = modifiers.has('shift')
  const wantAlt = modifiers.has('alt') || modifiers.has('option')

  if (event.ctrlKey !== wantCtrl) return false
  if (event.metaKey !== wantMeta) return false
  if (event.shiftKey !== wantShift) return false
  if (event.altKey !== wantAlt) return false

  return event.key.toLowerCase() === key
}

export function matchesAnyHotkey(event: KeyboardEvent, spec: string | string[] | undefined): boolean {
  if (!spec) return false
  const specs = Array.isArray(spec) ? spec : [spec]
  return specs.some((one) => matchesHotkey(event, one))
}

/** Renders a spec for display in a menu, using the platform's glyphs. */
export function formatHotkey(spec: string | string[] | undefined): string | undefined {
  if (!spec) return undefined
  const first = Array.isArray(spec) ? spec[0] : spec
  return first
    .split('+')
    .map((part) => {
      const lower = part.toLowerCase().trim()
      if (lower === 'mod') return isMac ? '⌘' : 'Ctrl'
      if (lower === 'cmd' || lower === 'meta') return '⌘'
      if (lower === 'ctrl') return isMac ? '⌃' : 'Ctrl'
      if (lower === 'shift') return isMac ? '⇧' : 'Shift'
      if (lower === 'alt' || lower === 'option') return isMac ? '⌥' : 'Alt'
      if (lower === 'delete') return isMac ? '⌫' : 'Del'
      if (lower === 'enter') return '↵'
      return part.length === 1 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)
    })
    .join(isMac ? '' : '+')
}

/**
 * True when the event came from somewhere that owns its own keystrokes — a text
 * field, or anything inside a dialog. Hotkeys must not fire there, or typing a
 * filename into the rename box would trigger Delete and Copy.
 */
export function isFromTextEntry(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element || typeof element.closest !== 'function') return false
  if (element.isContentEditable) return true
  const tag = element.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return element.closest('[role="dialog"], [role="alertdialog"]') !== null
}
