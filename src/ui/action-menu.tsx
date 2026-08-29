import { Fragment, type ReactNode } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@fsg/gui-bytes/components/ui'
import { useFileBrowserContext } from '../core/context'
import { formatHotkey } from '../core/hotkeys'
import type { FileAction } from '../core/types'

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

export function FileContextMenu({ children }: { children: ReactNode }) {
  const { actions, actionContext, isActionEnabled, dispatch } = useFileBrowserContext()

  const items = actions.filter((action) => action.contextMenu && (action.isVisible?.(actionContext) ?? true))
  const groups = groupActions(items)

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
                  disabled={!isActionEnabled(action)}
                  onSelect={() => void dispatch(action.id)}
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
