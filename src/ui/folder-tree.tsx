import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { cn } from '../util/cn'
import { joinPath, uniqueName } from '../util/names'
import { useFileBrowserContext } from '../core/context'
import { FileActionId } from '../core/actions'
import { FileContextMenu } from './action-menu'
import type { FileEntry } from '../core/types'
import { INTERNAL_DRAG_TYPE } from './use-entry-interaction'
import { Spinner } from './primitives/progress'

interface TreeNode {
  path: string
  name: string
  /** Child folder paths, or undefined until the node has been expanded once. */
  children?: string[]
  loading: boolean
  /**
   * The entry this row came from, kept so its context menu has something to act
   * on. A tree row is not part of the listing, so there is no selection to read —
   * every action has to name its own subject. The root has none: it was never
   * listed as anyone's child.
   */
  entry?: FileEntry
}

/**
 * What the tree offers on right-click.
 *
 * Only actions that operate on the folder itself. Create and upload would read
 * the listing's current path rather than the row's, which reads as the menu
 * lying about what it will do.
 */
const TREE_ACTIONS = [FileActionId.OpenFiles, FileActionId.Rename, FileActionId.Delete] as const

/**
 * Lazily-loaded folder tree. Children are fetched on first expand and then cached
 * for the session, so re-expanding a branch is instant and browsing the tree
 * doesn't re-hit the backend for folders already seen.
 */
export function FolderTree({ className }: { className?: string }) {
  const { state, handle, adapter, rootPath, dragAndDropEnabled } = useFileBrowserContext()
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
        const directories = entries.filter((entry) => entry.isDir)
        const childPaths = directories.map((entry) => joinPath(path, entry.name))
        setNodes((current) => {
          const next = { ...current }
          next[path] = { ...next[path], path, children: childPaths, loading: false }
          directories.forEach((entry, index) => {
            const child = childPaths[index]
            // Refresh the entry even for a node already known: a rename changes the
            // name and a stale one would rename the wrong thing next time.
            next[child] = { ...next[child], path: child, name: entry.name, loading: next[child]?.loading ?? false, entry }
          })
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

  // A mutation can add, remove or rename a folder anywhere, including one renamed
  // from the tree itself — which the listing never sees. Reloading every expanded
  // branch is bounded by what the user has actually opened, and is the only way
  // the tree does not drift from the truth.
  useEffect(() => {
    for (const path of expanded) {
      if (nodes[path]?.children) void loadChildren(path)
    }
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

  const canDrop = dragAndDropEnabled

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
    const output: { path: string; name: string; depth: number; entry?: FileEntry }[] = []
    const walk = (path: string, name: string, depth: number) => {
      output.push({ path, name, depth, entry: nodes[path]?.entry })
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
        {rows.map(({ path, name, depth, entry }) => {
          const node = nodes[path]
          const isExpanded = expanded.has(path)
          const isActive = state.path === path
          const hasChildren = node?.children === undefined || node.children.length > 0

          return (
            <li key={path} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isActive}>
              <TreeRowMenu entry={entry}>
              <div
                onClick={() => void handle.navigate(path)}
                // The root has no entry, so TreeRowMenu leaves it bare. Swallowing
                // the event keeps it from being the one row in the browser that
                // answers a plain right-click with the page's own menu. ⌘/Ctrl
                // still reaches it: that stops propagation before this ever runs.
                onContextMenu={entry ? undefined : (event) => event.preventDefault()}
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
              </TreeRowMenu>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Wraps a tree row in the browser's own context menu.
 *
 * The root row has no entry behind it — nothing lists the mount point itself — and
 * none of the tree's actions apply to it: it cannot be renamed, deleted, or opened
 * to anywhere it is not already. It is left unwrapped, and the row swallows the
 * event rather than offering a menu with nothing in it.
 */
function TreeRowMenu({ entry, children }: { entry?: FileEntry; children: React.ReactNode }) {
  if (!entry) return <>{children}</>
  return (
    <FileContextMenu target={entry} include={TREE_ACTIONS}>
      {children}
    </FileContextMenu>
  )
}
