import { useEffect } from 'react'
import { useFileBrowserContext } from '../core/context'
import { isFromTextEntry, matchesAnyHotkey } from '../core/hotkeys'

/**
 * Binds the resolved actions' hotkeys, scoped to the browser's root element.
 *
 * Scoped rather than global: Chonky bound hotkeys to the document, so two browsers
 * on one page both fired, and ⌘C anywhere in the host app hit the file browser's
 * copy. Listening on the root means the shortcut only applies while focus is
 * actually inside the browser.
 */
export function useHotkeys(rootRef: React.RefObject<HTMLElement | null>) {
  const { actions, dispatch, isActionEnabled, handle } = useFileBrowserContext()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onKeyDown = (event: KeyboardEvent) => {
      // A dialog or text field owns its own keystrokes; firing Delete while the
      // user types a filename would be catastrophic.
      if (isFromTextEntry(event.target)) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        handle.selectAll()
        return
      }

      for (const action of actions) {
        if (!matchesAnyHotkey(event, action.hotkey)) continue
        if (!isActionEnabled(action)) return
        event.preventDefault()
        event.stopPropagation()
        void dispatch(action.id)
        return
      }
    }

    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [rootRef, actions, dispatch, isActionEnabled, handle])
}
