import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '../../util/cn'
import { useFileBrowserContext } from '../../core/context'
import { useEntryInteraction } from '../use-entry-interaction'
import { resolveSelection } from '../../core/selection'
import { FileActionId } from '../../core/actions'
import { EmptyState, ErrorState, LoadingState } from '../empty-state'
import { FileContextMenu } from '../action-menu'
import { GridView } from './grid-view'
import { ListView } from './list-view'
import { DetailsView, type DetailsColumn } from './details-view'
import { isNavigationKey, nextIndexForKey } from './keyboard-nav'

export interface FileListingProps {
  detailsColumns?: DetailsColumn[]
  className?: string
}

/**
 * The scrollable listing: view switching, roving focus, range selection by
 * keyboard, and the right-click menu. External file drops are handled a level up
 * by the dropzone, which needs to cover the whole browser rather than just the rows.
 */
export function FileListing({ detailsColumns, className }: FileListingProps) {
  const { state, visible, handle, dispatch, readOnly } = useFileBrowserContext()
  const interaction = useEntryInteraction()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)

  const gridColumns = state.viewMode === 'grid' ? columns : 1

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (visible.length === 0) return

      if (isNavigationKey(event)) {
        const focusedIndex = visible.findIndex((entry) => entry.id === state.focusedId)
        const next = nextIndexForKey(event.key, { count: visible.length, focusedIndex, columns: gridColumns })
        if (next === null) return

        event.preventDefault()
        const target = visible[next]

        if (event.shiftKey) {
          // Shift+arrow extends the range from the anchor, the same resolution a
          // shift-click uses — so mixing mouse and keyboard behaves consistently.
          const resolved = resolveSelection({
            visible,
            selection: state.selection,
            anchorId: state.anchorId ?? state.focusedId,
            targetId: target.id,
            toggle: false,
            range: true,
          })
          handle.applySelection(resolved)
        } else if (event.ctrlKey || event.metaKey) {
          // Move focus without disturbing the selection, so the user can walk to an
          // entry and Space-toggle it.
          handle.setFocus(target.id)
        } else {
          handle.applySelection({ selection: [target.id], anchorId: target.id, focusedId: target.id })
        }

        interaction.focusIndex(next)
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        handle.selectAll()
        return
      }

      if (event.key === 'Escape') {
        handle.clearSelection()
        return
      }

      if (event.key === 'Backspace' && (event.metaKey || event.altKey)) {
        event.preventDefault()
        void handle.navigateUp()
      }
    },
    [visible, state.focusedId, state.selection, state.anchorId, gridColumns, handle, interaction],
  )

  const body = () => {
    if (state.status === 'loading' && state.entries.length === 0) return <LoadingState />
    if (state.status === 'error' && state.error) return <ErrorState message={state.error} onRetry={() => void handle.refresh()} />
    if (visible.length === 0) {
      return (
        <EmptyState
          searching={state.search.trim().length > 0}
          readOnly={readOnly}
          onUpload={() => void dispatch(FileActionId.UploadFiles)}
        />
      )
    }

    switch (state.viewMode) {
      case 'list':
        return <ListView entries={visible} interaction={interaction} scrollRef={scrollRef} />
      case 'details':
        return <DetailsView entries={visible} interaction={interaction} scrollRef={scrollRef} columns={detailsColumns} />
      case 'grid':
      default:
        return <GridView entries={visible} interaction={interaction} scrollRef={scrollRef} onColumnsChange={setColumns} />
    }
  }

  return (
    <FileContextMenu>
      <div
        ref={scrollRef}
        role="listbox"
        aria-multiselectable
        aria-label="Files"
        aria-busy={state.status === 'loading'}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        // A click that reaches the container came from the empty space around the
        // entries, which every file manager treats as "deselect".
        onClick={() => handle.clearSelection()}
        className={cn('relative h-full flex-1 overflow-auto outline-none', className)}
      >
        {body()}
        {/* A refresh over existing content dims rather than replacing it, so the
            listing doesn't collapse to a spinner on every mutation. */}
        {state.status === 'loading' && state.entries.length > 0 && (
          <div className="pointer-events-none absolute inset-0 bg-background/40" aria-hidden />
        )}
      </div>
    </FileContextMenu>
  )
}
