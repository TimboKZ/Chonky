import { useLayoutEffect, useRef, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@fsg/gui-bytes/components/ui'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../util/cn'
import { useFileBrowserContext } from '../core/context'
import { INTERNAL_DRAG_TYPE } from './use-entry-interaction'
import { uniqueName } from '../util/names'
import type { FolderChainItem } from '../core/types'

/** Crumbs shown in full before the middle collapses behind a “…” menu. */
const MAX_VISIBLE = 4

export function Breadcrumbs({ className }: { className?: string }) {
  const { state, handle, adapter, dragAndDropEnabled } = useFileBrowserContext()
  const chain = state.folderChain
  const containerRef = useRef<HTMLElement>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  // Scroll the trail to its end when it grows, so the folder the user just entered
  // is the one on screen rather than the root they started from.
  useLayoutEffect(() => {
    const element = containerRef.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [chain.length])

  const canDropInto = dragAndDropEnabled

  const dropInto = async (crumb: FolderChainItem, ids: string[]) => {
    const entries = state.entries.filter((entry) => ids.includes(entry.id))
    if (entries.length === 0 || !adapter.move) return
    try {
      let taken: string[] = []
      try {
        taken = (await adapter.list(crumb.path)).entries.map((entry) => entry.name)
      } catch {
        // Not listable — let the backend arbitrate collisions.
      }
      for (const entry of entries) {
        const name = uniqueName(entry.name, taken)
        taken.push(name)
        await adapter.move({ entry, destination: crumb.path, name })
      }
      await handle.refresh()
    } catch (e) {
      console.error('Failed to move items', e)
      handle.notify({ level: 'error', message: 'Failed to move items' })
    }
  }

  const crumbProps = (crumb: FolderChainItem, isLast: boolean) => ({
    'onClick': () => {
      if (!isLast) void handle.navigate(crumb.path)
    },
    'onDragOver': (event: React.DragEvent) => {
      if (!canDropInto || isLast || !event.dataTransfer.types.includes(INTERNAL_DRAG_TYPE)) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setDropTarget(crumb.path)
    },
    'onDragLeave': () => setDropTarget((current) => (current === crumb.path ? null : current)),
    'onDrop': (event: React.DragEvent) => {
      if (!canDropInto || isLast) return
      const raw = event.dataTransfer.getData(INTERNAL_DRAG_TYPE)
      if (!raw) return
      event.preventDefault()
      setDropTarget(null)
      try {
        void dropInto(crumb, JSON.parse(raw) as string[])
      } catch {
        // Malformed payload — ignore.
      }
    },
    'data-drop-target': dropTarget === crumb.path,
  })

  const crumbClass = (isLast: boolean) =>
    cn(
      'max-w-[16ch] shrink-0 truncate rounded-md px-1.5 py-1 text-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'data-[drop-target=true]:bg-primary/15 data-[drop-target=true]:ring-2 data-[drop-target=true]:ring-primary',
      isLast ? 'font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )

  const collapsed = chain.length > MAX_VISIBLE
  const head = collapsed ? chain.slice(0, 1) : chain
  const hidden = collapsed ? chain.slice(1, chain.length - (MAX_VISIBLE - 2)) : []
  const tail = collapsed ? chain.slice(chain.length - (MAX_VISIBLE - 2)) : []

  const renderCrumb = (crumb: FolderChainItem, index: number, total: number) => {
    const isLast = crumb.path === chain[chain.length - 1]?.path
    return (
      <li key={crumb.path || crumb.id} className="flex shrink-0 items-center">
        <button type="button" {...crumbProps(crumb, isLast)} className={crumbClass(isLast)} aria-current={isLast ? 'page' : undefined}>
          {crumb.name}
        </button>
        {(index < total - 1 || !isLast) && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />}
      </li>
    )
  }

  return (
    <nav ref={containerRef} aria-label="Folder path" className={cn('min-w-0 overflow-x-auto', className)}>
      <ol className="flex items-center gap-0.5">
        {head.map((crumb, index) => renderCrumb(crumb, index, head.length))}

        {collapsed && (
          <li className="flex shrink-0 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-md px-1 py-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                aria-label={`Show ${hidden.length} hidden folders`}
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="fsg-fb-surface" align="start">
                {hidden.map((crumb) => (
                  <DropdownMenuItem key={crumb.path} onSelect={() => void handle.navigate(crumb.path)}>
                    {crumb.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
          </li>
        )}

        {tail.map((crumb, index) => renderCrumb(crumb, index, tail.length))}
      </ol>
    </nav>
  )
}
