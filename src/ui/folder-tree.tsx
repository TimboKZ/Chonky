import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { cn } from '../util/cn'
import { joinPath, uniqueName } from '../util/names'
import { useFileBrowserContext } from '../core/context'
import { adapterCan } from '../adapter/types'
import { INTERNAL_DRAG_TYPE } from './use-entry-interaction'
import { Spinner } from './primitives/progress'

interface TreeNode {
  path: string
  name: string
  /** Child folder paths, or undefined until the node has been expanded once. */
  children?: string[]
  loading: boolean
}

/**
 * Lazily-loaded folder tree. Children are fetched on first expand and then cached
 * for the session, so re-expanding a branch is instant and browsing the tree
 * doesn't re-hit the backend for folders already seen.
 */
export function FolderTree({ className }: { className?: string }) {
  const { state, handle, adapter, rootPath, readOnly } = useFileBrowserContext()
  const rootName = state.folderChain[0]?.name ?? 'Files'

  const [nodes, setNodes] = useState<Record<string, TreeNode>>({})
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([rootPath]))
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  const loadChildren = useCallback(
    async (path: string) => {
      setNodes((current) => ({
        ...current,
        [path]: { path, name: current[path]?.name ?? path.split('/').pop() ?? rootName, children: current[path]?.children, loading: true },
      }))
      try {
        const { entries } = await adapter.list(path)
        const childPaths = entries.filter((entry) => entry.isDir).map((entry) => joinPath(path, entry.name))
        setNodes((current) => {
          const next = { ...current }
          next[path] = { ...next[path], path, children: childPaths, loading: false }
          for (const child of childPaths) {
            next[child] ??= { path: child, name: child.split('/').pop() ?? child, loading: false }
          }
          return next
        })
      } catch {
        // A folder that fails to list collapses to a leaf rather than showing an
        // error row — the listing pane already reports load failures.
        setNodes((current) => ({ ...current, [path]: { ...current[path], path, children: [], loading: false } }))
      }
    },
    [adapter, rootName],
  )

  useEffect(() => {
    if (!nodes[rootPath]?.children && !nodes[rootPath]?.loading) void loadChildren(rootPath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootPath])

  // A mutation elsewhere can add or remove folders; refresh the branch currently
  // being viewed so the tree doesn't drift from the listing.
  useEffect(() => {
    if (expanded.has(state.path)) void loadChildren(state.path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.entries])

  // Reveal the active path: every ancestor between the root and it must be open.
  useEffect(() => {
    const relative = state.path.slice(rootPath.length).split('/').filter(Boolean)
    let current = rootPath
    const toOpen = [rootPath]
    for (const segment of relative) {
      current = joinPath(current, segment)
      toOpen.push(current)
    }
    setExpanded((currentExpanded) => {
      const next = new Set(currentExpanded)
      let changed = false
      for (const path of toOpen) {
        if (!next.has(path)) {
          next.add(path)
          changed = true
        }
      }
      return changed ? next : currentExpanded
    })
    for (const path of toOpen) {
      if (!nodes[path]?.children && !nodes[path]?.loading) void loadChildren(path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.path, rootPath])

  const toggle = useCallback(
    (path: string) => {
      setExpanded((current) => {
        const next = new Set(current)
        if (next.has(path)) next.delete(path)
        else {
          next.add(path)
          if (!nodes[path]?.children && !nodes[path]?.loading) void loadChildren(path)
        }
        return next
      })
    },
    [nodes, loadChildren],
  )

  const canDrop = adapterCan.move(adapter) && !readOnly

  const dropInto = useCallback(
    async (path: string, ids: string[]) => {
      const entries = state.entries.filter((entry) => ids.includes(entry.id))
      if (entries.length === 0 || !adapter.move) return
      try {
        let taken: string[] = []
        try {
          taken = (await adapter.list(path)).entries.map((entry) => entry.name)
        } catch {
          // Not listable — let the backend arbitrate collisions.
        }
        for (const entry of entries) {
          const name = uniqueName(entry.name, taken)
          taken.push(name)
          await adapter.move({ entry, destination: path, name })
        }
        await handle.refresh()
        void loadChildren(path)
      } catch (e) {
        console.error('Failed to move items', e)
        handle.notify({ level: 'error', message: 'Failed to move items' })
      }
    },
    [adapter, state.entries, handle, loadChildren],
  )

  const rows = useMemo(() => {
    const output: { path: string; name: string; depth: number }[] = []
    const walk = (path: string, name: string, depth: number) => {
      output.push({ path, name, depth })
      if (!expanded.has(path)) return
      for (const child of nodes[path]?.children ?? []) {
        walk(child, nodes[child]?.name ?? child.split('/').pop() ?? child, depth + 1)
      }
    }
    walk(rootPath, rootName, 0)
    return output
  }, [nodes, expanded, rootPath, rootName])

  return (
    <div className={cn('w-56 shrink-0 overflow-auto border-r border-border bg-sidebar py-2', className)}>
      <ul role="tree" aria-label="Folders" className="text-sm">
        {rows.map(({ path, name, depth }) => {
          const node = nodes[path]
          const isExpanded = expanded.has(path)
          const isActive = state.path === path
          const hasChildren = node?.children === undefined || node.children.length > 0

          return (
            <li key={path} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isActive}>
              <div
                onClick={() => void handle.navigate(path)}
                onDragOver={(event) => {
                  if (!canDrop || !event.dataTransfer.types.includes(INTERNAL_DRAG_TYPE)) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                  setDropTarget(path)
                }}
                onDragLeave={() => setDropTarget((current) => (current === path ? null : current))}
                onDrop={(event) => {
                  if (!canDrop) return
                  const raw = event.dataTransfer.getData(INTERNAL_DRAG_TYPE)
                  if (!raw) return
                  event.preventDefault()
                  setDropTarget(null)
                  try {
                    void dropInto(path, JSON.parse(raw) as string[])
                  } catch {
                    // Malformed payload — ignore.
                  }
                }}
                style={{ paddingLeft: 8 + depth * 12 }}
                className={cn(
                  'flex cursor-default items-center gap-1 py-1 pr-2 transition-colors',
                  'hover:bg-sidebar-accent/60',
                  isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                  dropTarget === path && 'ring-2 ring-inset ring-primary',
                )}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={isExpanded ? `Collapse ${name}` : `Expand ${name}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle(path)
                  }}
                  className={cn('shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground', !hasChildren && 'invisible')}
                >
                  {node?.loading ? (
                    <Spinner className="size-3 border" />
                  ) : (
                    <ChevronRight className={cn('size-3.5 transition-transform', isExpanded && 'rotate-90')} />
                  )}
                </button>
                {isExpanded ? <FolderOpen className="size-4 shrink-0 text-primary" /> : <Folder className="size-4 shrink-0 text-primary" />}
                <span className="truncate">{name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
