import {
  Tooltip as GuiTooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider as GuiTooltipProvider,
} from '@fsg/gui-bytes/components/ui'
import type { ReactNode } from 'react'

export const TooltipProvider = GuiTooltipProvider

/**
 * Single-element tooltip.
 *
 * gui-bytes exposes the Radix parts; nearly every use here is "one trigger, one
 * short string", so this collapses that into a prop and renders the child
 * untouched when there is nothing to say.
 */
export function Tooltip({
  content,
  children,
  side = 'bottom',
}: {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  if (!content) return <>{children}</>
  return (
    <GuiTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={6}>
        {content}
      </TooltipContent>
    </GuiTooltip>
  )
}
