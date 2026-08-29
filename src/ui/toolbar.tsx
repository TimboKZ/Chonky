import { useEffect, useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@fsg/gui-bytes/components/ui'
import { ArrowUp, LayoutGrid, List, MoreVertical, Rows3, Search, X } from 'lucide-react'
import { cn } from '../util/cn'
import { useFileBrowserContext } from '../core/context'
import { Button } from './primitives/button'
import { Input } from './primitives/input'
import { Tooltip } from './primitives/tooltip'
import { Breadcrumbs } from './breadcrumbs'
import type { ViewMode } from '../core/types'

const VIEW_MODES: { value: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'grid', label: 'Grid', icon: LayoutGrid },
  { value: 'list', label: 'List', icon: List },
  { value: 'details', label: 'Details', icon: Rows3 },
]

function ViewModeToggle() {
  const { state, handle } = useFileBrowserContext()
  return (
    <div role="radiogroup" aria-label="View mode" className="flex items-center rounded-md border border-border p-0.5">
      {VIEW_MODES.map(({ value, label, icon: Icon }) => (
        <Tooltip key={value} content={`${label} view`}>
          <button
            type="button"
            role="radio"
            aria-checked={state.viewMode === value}
            aria-label={`${label} view`}
            onClick={() => handle.setViewMode(value)}
            className={cn(
              'rounded-sm p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              state.viewMode === value ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}

function SearchBox() {
  const { state, handle } = useFileBrowserContext()
  const [value, setValue] = useState(state.search)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced so typing doesn't re-sort and re-virtualize a large listing on every
  // keystroke. Kept local-first so the field never lags behind the user.
  useEffect(() => {
    const id = setTimeout(() => handle.setSearch(value), 150)
    return () => clearTimeout(id)
  }, [value, handle])

  useEffect(() => {
    if (state.search === '' && value !== '') setValue('')
    // Only mirrors an external reset (e.g. navigation); local edits own the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.search])

  return (
    <div className="relative w-full max-w-56">
      <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        ref={inputRef}
        type="search"
        value={value}
        aria-label="Search this folder"
        placeholder="Search…"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          // Stop hotkeys from firing while the user types a filename.
          event.stopPropagation()
          if (event.key === 'Escape') {
            setValue('')
            handle.setSearch('')
          }
        }}
        className="h-8 pl-8 pr-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue('')
            handle.setSearch('')
            inputRef.current?.focus()
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function OverflowMenu() {
  const { state, handle, actions, actionContext, isActionEnabled, dispatch } = useFileBrowserContext()

  // Toolbar actions that didn't fit as buttons, plus the view preferences that have
  // no dedicated control.
  const overflow = actions.filter(
    (action) => action.toolbar && action.iconOnly !== true && (action.isVisible?.(actionContext) ?? true),
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="More options">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* fsg-fb-surface: portalled to document.body, outside the browser root. */}
      <DropdownMenuContent className="fsg-fb-surface" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {overflow.map((action) => {
          const Icon = action.icon
          return (
            <DropdownMenuItem key={action.id} disabled={!isActionEnabled(action)} onSelect={() => void dispatch(action.id)}>
              {Icon && <Icon className="size-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={state.density === 'compact'}
          onCheckedChange={(checked: boolean) => handle.setDensity(checked ? 'compact' : 'comfortable')}
        >
          Compact rows
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={state.showHidden} onCheckedChange={(checked: boolean) => handle.setShowHidden(checked === true)}>
          Show hidden files
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface FileToolbarProps {
  className?: string
  /** Rendered at the end of the toolbar, before the overflow menu. */
  children?: React.ReactNode
}

export function FileToolbar({ className, children }: FileToolbarProps) {
  const { state, handle, actions, actionContext, isActionEnabled, dispatch, rootPath } = useFileBrowserContext()

  const buttons = actions.filter((action) => action.toolbar && (action.isVisible?.(actionContext) ?? true))
  const primary = buttons.filter((action) => !action.iconOnly)
  const iconOnly = buttons.filter((action) => action.iconOnly)
  const atRoot = state.path === rootPath

  return (
    <div className={cn('flex flex-wrap items-center gap-2 border-b border-border px-2 py-2', className)}>
      <Tooltip content="Up one folder">
        <Button variant="ghost" size="icon-sm" aria-label="Up one folder" disabled={atRoot} onClick={() => void handle.navigateUp()}>
          <ArrowUp className="size-4" />
        </Button>
      </Tooltip>

      <Breadcrumbs className="min-w-0 flex-1" />

      <div className="flex items-center gap-2">
        <SearchBox />
        <ViewModeToggle />

        {/* Primary actions collapse into the overflow menu below `sm`, where a full
            button row would push the breadcrumbs off screen. */}
        <div className="hidden items-center gap-1 sm:flex">
          {primary.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant={action.destructive ? 'destructive' : 'outline'}
                size="sm"
                disabled={!isActionEnabled(action)}
                onClick={() => void dispatch(action.id)}
              >
                {Icon && <Icon className="size-4" />}
                {/* sr-only rather than hidden: `display: none` drops the label out of
                    the accessibility tree, leaving an icon-only button with no
                    accessible name on narrower viewports. */}
                <span className="sr-only lg:not-sr-only">{action.label}</span>
              </Button>
            )
          })}
        </div>

        {iconOnly.map((action) => {
          const Icon = action.icon
          return (
            <Tooltip key={action.id} content={action.label}>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={action.label}
                disabled={!isActionEnabled(action)}
                onClick={() => void dispatch(action.id)}
              >
                {Icon && <Icon className="size-4" />}
              </Button>
            </Tooltip>
          )
        })}

        {children}
        <div className="sm:hidden">
          <OverflowMenu />
        </div>
      </div>
    </div>
  )
}
