import { useEffect, type RefObject } from 'react'
import { wantsNativeContextMenu } from '../core/hotkeys'

/**
 * Lets ⌘/Ctrl + right-click reach the browser's own context menu.
 *
 * Every row, the empty space around them and each tree node carry a custom menu,
 * which leaves a developer no way to reach Inspect anywhere inside the component.
 *
 * Capturing on the way down and stopping there is what makes it work: React
 * dispatches its synthetic events from the root container *above* this element, so
 * an event stopped here never bubbles back up to it, Radix's `onContextMenu` never
 * runs, and the default menu is simply left alone. Preventing Radix any later would
 * mean closing a menu that had already opened.
 */
export function useNativeContextMenuEscape(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const escape = (event: MouseEvent) => {
      if (wantsNativeContextMenu(event)) event.stopPropagation()
    }

    element.addEventListener('contextmenu', escape, { capture: true })
    return () => element.removeEventListener('contextmenu', escape, { capture: true })
  }, [ref])
}
