import { DialogContent as GuiDialogContent } from '@fsg/gui-bytes/components/ui'
import type { ComponentProps } from 'react'
import { cn } from '../../util/cn'

export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@fsg/gui-bytes/components/ui'

export type DialogSize = 'sm' | 'md' | 'lg' | 'full'

/* Sized by max-width token rather than a raw value so the dialog tracks the same
 * scale as the rest of the design system. */
const SIZES: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  full: 'max-w-[min(96vw,1400px)] h-[92vh]',
}

/**
 * gui-bytes' dialog content, with the size vocabulary this package's call sites use.
 *
 * `w-full` is deliberate: gui-bytes' dialog is `w-max` — it shrink-wraps its
 * content, which suits a confirmation but leaves a rename prompt as a ~220px box
 * with a cramped text field. Opting into the full width lets `max-w-*` set the
 * size. twMerge resolves the conflict in this className's favour.
 */
export function DialogContent({
  className,
  size = 'md',
  ...props
}: ComponentProps<typeof GuiDialogContent> & { size?: DialogSize }) {
  return <GuiDialogContent className={cn('fsg-fb-surface flex w-full flex-col gap-4', SIZES[size], className)} {...props} />
}
