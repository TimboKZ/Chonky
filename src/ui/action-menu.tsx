import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { useFileBrowserContext } from '../core/context'
import { formatHotkey } from '../core/hotkeys'
import { menuContentClass, menuDestructiveItemClass, menuItemClass, menuSeparatorClass, menuShortcutClass } from './primitives/menu'
import type { FileAction } from '../core/types'

/** Groups actions in declaration order, so a consumer's added action lands beside
 * the ones it belongs with rather than in a group sorted alphabetically. */
function groupActions(actions: FileAction[]): [string, FileAction[]][] {
  const groups = new Map<string, FileAction[]>()
  for (const action of actions) {
    const key = action.group ?? ''
    const list = groups.get(key) ?? []
    list.push(action)
    groups.set(key, list)
  }
  return [...groups.entries()]
}

export function FileContextMenu({ children }: { children: ReactNode }) {
  const { actions, actionContext, isActionEnabled, dispatch } = useFileBrowserContext()

  const items = actions.filter((action) => action.contextMenu !== false && action.contextMenu && (action.isVisible?.(actionContext) ?? true))
  const groups = groupActions(items)

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content className={menuContentClass}>
          {groups.map(([group, groupActionList], groupIndex) => (
            <Fragment key={group || `group-${groupIndex}`}>
              {groupIndex > 0 && <ContextMenuPrimitive.Separator className={menuSeparatorClass} />}
              {groupActionList.map((action) => {
                const Icon = action.icon
                const shortcut = formatHotkey(action.hotkey)
                return (
                  <ContextMenuPrimitive.Item
                    key={action.id}
                    disabled={!isActionEnabled(action)}
                    onSelect={() => void dispatch(action.id)}
                    className={action.destructive ? menuDestructiveItemClass : menuItemClass}
                  >
                    {Icon && <Icon className="size-4" />}
                    <span>{action.label}</span>
                    {shortcut && <span className={menuShortcutClass}>{shortcut}</span>}
                  </ContextMenuPrimitive.Item>
                )
              })}
            </Fragment>
          ))}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  )
}
