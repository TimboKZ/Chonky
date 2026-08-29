import { cn } from '../../util/cn'

/* Shared between the dropdown and context menus so a given action looks and
 * measures identically wherever it is invoked from. */

export const menuContentClass = cn(
  // fsg-fb-surface: this content is portalled to document.body, outside the
  // browser root, so it carries its own hook for the scoped reset in styles.css.
  'fsg-fb-surface z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
)

export const menuItemClass = cn(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
  'focus:bg-accent focus:text-accent-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
)

export const menuDestructiveItemClass = cn(
  menuItemClass,
  'text-destructive focus:bg-destructive/10 focus:text-destructive',
)

export const menuSeparatorClass = '-mx-1 my-1 h-px bg-border'

export const menuLabelClass = 'px-2 py-1.5 text-xs font-medium text-muted-foreground'

export const menuShortcutClass = 'ml-auto pl-4 text-xs tracking-widest text-muted-foreground'
