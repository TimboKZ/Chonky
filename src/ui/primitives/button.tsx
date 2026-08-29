import { forwardRef, type ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../util/cn'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'

/* Class strings mirror @fsg/gui-bytes' Button so a browser dropped into an FSG app
 * is visually indistinguishable from the buttons around it — without importing it. */
const VARIANTS: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground border border-[color-mix(in_srgb,var(--primary),black_16%)] border-b-[color-mix(in_srgb,var(--primary),black_26%)] shadow-xs hover:bg-[color-mix(in_srgb,var(--primary),black_8%)] dark:border-0 dark:shadow-none dark:hover:bg-primary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60',
  outline: 'border border-input bg-background shadow-xs hover:bg-muted',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
  ghost: 'hover:bg-muted',
  link: 'text-primary underline-offset-4 hover:underline',
}

const SIZES: Record<ButtonSize, string> = {
  'default': 'h-9 px-4 py-2 has-[>svg]:px-3',
  'sm': 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
  'lg': 'h-10 rounded-md px-6 has-[>svg]:px-4',
  'icon': 'size-9',
  'icon-sm': 'size-8',
}

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all shrink-0 outline-none " +
  "disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:border-transparent disabled:shadow-none " +
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Render the child element with the button's styling — used for link buttons,
   * where an `<a>` is what belongs in the DOM. */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'default', type = 'button', asChild = false, ...props },
  ref,
) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      ref={ref}
      // Slot forwards props to an <a>, which has no `type` — passing one would
      // land an invalid attribute in the DOM.
      {...(asChild ? {} : { type })}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
})
