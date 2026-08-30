import { Fragment, useMemo, type ReactNode } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@fsg/gui-bytes/components/ui'
import { useFileBrowserContext } from '../core/context'
import { formatHotkey } from '../core/hotkeys'
import type { FileAction, FileEntry } from '../core/types'

/**
 * Menu section order, which is not the same as the toolbar's.
 *
 * A right-click is nearly always about the thing under the cursor, so what you can
 * do *to it* comes first and the folder-level Create actions come last — the order
 * every desktop file manager uses. The toolbar reads the other way round, which is
 * why this can't just follow the action array.
 */
const GROUP_ORDER = ['Open', 'Edit', 'Create']

/** Groups actions, ordering known sections by GROUP_ORDER and leaving any group a
 * consuming app added at the end, in the order it declared them. */
function groupActions(actions: FileAction[]): [string, FileAction[]][] {
  const groups = new Map<string, FileAction[]>()
  for (const action of actions) {
    const key = action.group ?? ''
    const list = groups.get(key) ?? []
    list.push(action)
    groups.set(key, list)
  }

  const rank = (group: string) => {
    const index = GROUP_ORDER.indexOf(group)
    return index === -1 ? GROUP_ORDER.length : index
  }

  return [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b))
}

export interface FileContextMenuProps {
  children: ReactNode
  /**
   * Act on this entry instead of the current selection.
   *
   * The folder tree needs it: its rows are not part of the listing, so there is no
   * selection to read and every action has to name its own subject.
   */
  target?: FileEntry
  /** Restrict the menu to these action ids, in the order the action list declares them. */
  include?: readonly string[]
}

export function FileContextMenu({ children, target, include }: FileContextMenuProps) {
  const { actions, actionContext, isActionEnabled, dispatch } = useFileBrowserContext()

  const items = useMemo(() => {
    const allowed = include ? actions.filter((action) => include.includes(action.id)) : actions
    return allowed.filter((action) => action.contextMenu && (action.isVisible?.(actionContext) ?? true))
  }, [actions, include, actionContext])

  const groups = groupActions(items)

  /* With an explicit target the selection is irrelevant — an action is available if
   * its own `appliesTo` accepts that entry. */
  const enabled = (action: FileAction) =>
    target ? !action.appliesTo || action.appliesTo(target) : isActionEnabled(action)

  const run = (action: FileAction) =>
    target ? dispatch(action.id, { origin: target, targets: [target] }) : dispatch(action.id)

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      {/* fsg-fb-surface: portalled to document.body, outside the browser root. */}
      <ContextMenuContent className="fsg-fb-surface min-w-[12rem]">
        {groups.map(([group, groupActionList], groupIndex) => (
          <Fragment key={group || `group-${groupIndex}`}>
            {groupIndex > 0 && <ContextMenuSeparator />}
            {groupActionList.map((action) => {
              const Icon = action.icon
              const shortcut = formatHotkey(action.hotkey)
              return (
                <ContextMenuItem
                  key={action.id}
                  variant={action.destructive ? 'destructive' : 'default'}
                  disabled={!enabled(action)}
                  onSelect={() => void run(action)}
                >
                  {Icon && <Icon className="size-4" />}
                  <span>{action.label}</span>
                  {shortcut && <span className="ml-auto pl-4 text-xs tracking-widest text-muted-foreground">{shortcut}</span>}
                </ContextMenuItem>
              )
            })}
          </Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
