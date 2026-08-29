import { useCallback, useRef, useState } from 'react'
import type { DragEvent, KeyboardEvent, MouseEvent } from 'react'
import { useFileBrowserContext } from '../core/context'
import { resolveSelection } from '../core/selection'
import { FileActionId } from '../core/actions'
import { joinPath, uniqueName } from '../util/names'
import type { FileEntry } from '../core/types'

/** Marks a drag as originating from this browser, so an external file drop and an
 * internal move can be told apart without inspecting the payload. */
const INTERNAL_DRAG_TYPE = 'application/x-fsg-file-browser'

export interface EntryInteraction {
  getEntryProps: (entry: FileEntry, index: number) => {
    'role': string
    'tabIndex': number
    'aria-selected': boolean
    'data-selected': boolean
    'data-focused': boolean
    'data-dragging': boolean
    'data-drop-target': boolean
    'draggable': boolean
    'onClick': (event: MouseEvent) => void
    'onDoubleClick': (event: MouseEvent) => void
    'onContextMenu': (event: MouseEvent) => void
    'onKeyDown': (event: KeyboardEvent) => void
    'onDragStart': (event: DragEvent) => void
    'onDragEnd': () => void
    'onDragOver': (event: DragEvent) => void
    'onDragLeave': () => void
    'onDrop': (event: DragEvent) => void
    'ref': (element: HTMLElement | null) => void
  }
  /** Focuses an entry by index, scrolling it into view. Used by keyboard navigation. */
  focusIndex: (index: number) => void
  registerRef: (id: string, element: HTMLElement | null) => void
}

export function useEntryInteraction(): EntryInteraction {
  const { handle, visible, state, dispatch, adapter, dragAndDropEnabled, isEntryLocked } = useFileBrowserContext()

  const [draggingIds, setDraggingIds] = useState<ReadonlySet<string>>(new Set())
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const refs = useRef(new Map<string, HTMLElement>())

  const registerRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) refs.current.set(id, element)
    else refs.current.delete(id)
  }, [])

  const focusIndex = useCallback(
    (index: number) => {
      const entry = visible[Math.max(0, Math.min(index, visible.length - 1))]
      if (!entry) return
      const element = refs.current.get(entry.id)
      element?.focus()
      element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    },
    [visible],
  )

  const canMove = dragAndDropEnabled

  const moveInto = useCallback(
    async (destinationEntry: FileEntry, ids: string[]) => {
      const requested = state.entries.filter((entry) => ids.includes(entry.id))
      const movable = requested.filter((entry) => !isEntryLocked(entry) && entry.id !== destinationEntry.id)
      const blocked = requested.length - movable.length

      if (blocked > 0) {
        handle.notify({
          level: 'warning',
          message: blocked === 1 ? 'That item can’t be moved.' : `${blocked} items can’t be moved.`,
        })
      }
      if (movable.length === 0 || !adapter.move) return

      const destination = joinPath(state.path, destinationEntry.name)
      try {
        let taken: string[] = []
        try {
          taken = (await adapter.list(destination)).entries.map((entry) => entry.name)
        } catch {
          // Not listable yet — let the backend arbitrate any collision.
        }
        for (const entry of movable) {
          const name = uniqueName(entry.name, taken)
          taken.push(name)
          await adapter.move({ entry, destination, name })
        }
        await handle.refresh()
      } catch (e) {
        console.error('Failed to move items', e)
        handle.notify({ level: 'error', message: 'Failed to move items' })
      }
    },
    [adapter, state.entries, state.path, handle, isEntryLocked],
  )

  const select = useCallback(
    (entry: FileEntry, event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean }) => {
      const next = resolveSelection({
        visible,
        selection: state.selection,
        anchorId: state.anchorId,
        targetId: entry.id,
        toggle: event.metaKey || event.ctrlKey,
        range: event.shiftKey,
      })
      // Selection, anchor, and focus move together: a shift-click resolved against a
      // stale anchor would extend from the wrong end of the list.
      handle.applySelection(next)
    },
    [visible, state.selection, state.anchorId, handle],
  )

  const getEntryProps: EntryInteraction['getEntryProps'] = useCallback(
    (entry, index) => ({
      'role': 'option',
      // Roving tabindex: exactly one entry is tabbable, so Tab moves past the whole
      // listing rather than through every row in it.
      'tabIndex': state.focusedId === entry.id || (!state.focusedId && index === 0) ? 0 : -1,
      'aria-selected': state.selection.has(entry.id),
      'data-selected': state.selection.has(entry.id),
      'data-focused': state.focusedId === entry.id,
      'data-dragging': draggingIds.has(entry.id),
      'data-drop-target': dropTargetId === entry.id,
      'draggable': canMove,

      onClick(event: MouseEvent) {
        event.stopPropagation()
        select(entry, event)
      },

      onDoubleClick(event: MouseEvent) {
        event.stopPropagation()
        void dispatch(FileActionId.OpenFiles, { origin: entry, targets: [entry] })
      },

      onContextMenu() {
        // Right-clicking outside the selection retargets it, matching every desktop
        // file manager — otherwise the menu would act on entries the user can't see
        // they still have selected.
        if (!state.selection.has(entry.id)) {
          handle.setSelection([entry.id])
        }
      },

      onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          event.preventDefault()
          void dispatch(FileActionId.OpenFiles, { origin: entry, targets: [entry] })
        } else if (event.key === ' ') {
          event.preventDefault()
          select(entry, { metaKey: true, ctrlKey: false, shiftKey: false })
        }
      },

      onDragStart(event: DragEvent) {
        if (!canMove) return
        // Dragging an unselected entry drags just that entry, without disturbing
        // the existing selection's meaning for the next click.
        const ids = state.selection.has(entry.id) ? [...state.selection] : [entry.id]
        setDraggingIds(new Set(ids))
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData(INTERNAL_DRAG_TYPE, JSON.stringify(ids))
        event.dataTransfer.setData('text/plain', ids.join(','))
      },

      onDragEnd() {
        setDraggingIds(new Set())
        setDropTargetId(null)
      },

      onDragOver(event: DragEvent) {
        if (!entry.isDir || !canMove) return
        const internal = event.dataTransfer.types.includes(INTERNAL_DRAG_TYPE)
        const external = event.dataTransfer.types.includes('Files')
        if (!internal && !external) return
        // Dropping a folder into itself is the one internal move that can't work.
        if (internal && draggingIds.has(entry.id)) return

        event.preventDefault()
        event.stopPropagation()
        event.dataTransfer.dropEffect = internal ? 'move' : 'copy'
        setDropTargetId(entry.id)
      },

      onDragLeave() {
        setDropTargetId((current) => (current === entry.id ? null : current))
      },

      onDrop(event: DragEvent) {
        if (!entry.isDir || !canMove) return
        const raw = event.dataTransfer.getData(INTERNAL_DRAG_TYPE)
        if (!raw) return
        // External file drops are handled by the dropzone that wraps the listing;
        // stopping here would swallow them.
        event.preventDefault()
        event.stopPropagation()
        setDropTargetId(null)
        setDraggingIds(new Set())
        try {
          void moveInto(entry, JSON.parse(raw) as string[])
        } catch {
          // Malformed payload from another app claiming our MIME type — ignore.
        }
      },

      ref(element: HTMLElement | null) {
        registerRef(entry.id, element)
      },
    }),
    [state.focusedId, state.selection, draggingIds, dropTargetId, canMove, select, dispatch, handle, moveInto, registerRef],
  )

  return { getEntryProps, focusIndex, registerRef }
}

export { INTERNAL_DRAG_TYPE }
