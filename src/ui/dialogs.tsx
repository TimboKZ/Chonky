import { useEffect, useRef, useState } from 'react'
import { useFileBrowserContext } from '../core/context'
import { getBaseName } from '../util/names'
import { Button } from './primitives/button'
import { Input } from './primitives/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './primitives/dialog'
import type { ConfirmOptions, PromptOptions } from '../core/types'

/**
 * Renders whichever dialog the engine is currently awaiting. One component rather
 * than several because only one request can be outstanding at a time — the engine
 * awaits each dialog's promise before moving on.
 */
export function FileBrowserDialogs() {
  const { dialog, closeDialog } = useFileBrowserContext()
  if (!dialog) return null

  return dialog.kind === 'prompt' ? (
    <PromptDialog options={dialog.options as PromptOptions} onClose={closeDialog} />
  ) : (
    <ConfirmDialog options={dialog.options as ConfirmOptions} onClose={closeDialog} />
  )
}

function PromptDialog({ options, onClose }: { options: PromptOptions; onClose: (value: string | null) => void }) {
  const [value, setValue] = useState(options.defaultValue ?? '')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Radix moves focus into the dialog on open; selecting afterwards means the
  // selection isn't immediately collapsed by that focus call.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return
      input.focus()
      if (!input.value) return
      // Rename selects the stem only, so typing replaces the name and keeps the
      // extension — the behaviour every desktop file manager has.
      const dot = options.selectStemOnly ? getBaseName(input.value).length : input.value.length
      input.setSelectionRange(0, dot > 0 ? dot : input.value.length)
    })
    return () => cancelAnimationFrame(id)
  }, [options.selectStemOnly])

  const validate = (next: string) => {
    const result = options.validate?.(next)
    setError(result && !result.valid ? (result.message ?? 'Invalid name') : null)
    return !result || result.valid
  }

  const submit = () => {
    if (!validate(value)) return
    onClose(value.trim())
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose(null)}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          {options.label && <label className="text-sm font-medium">{options.label}</label>}
          <Input
            ref={inputRef}
            value={value}
            aria-invalid={!!error}
            aria-describedby={error ? 'fsg-fb-prompt-error' : undefined}
            onChange={(event) => {
              setValue(event.target.value)
              validate(event.target.value)
            }}
            onKeyDown={(event) => {
              // The listing's hotkeys are document-level; a filename containing
              // "d" must not trigger Delete behind the dialog.
              event.stopPropagation()
              if (event.key === 'Enter') {
                event.preventDefault()
                submit()
              }
            }}
          />
          {error && (
            <p id="fsg-fb-prompt-error" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose(null)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!!error || value.trim().length === 0}>
            {options.submitLabel ?? 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDialog({ options, onClose }: { options: ConfirmOptions; onClose: (value: boolean) => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose(false)}>
      <DialogContent size="sm" role="alertdialog">
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
          {options.description && <DialogDescription>{options.description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant={options.destructive ? 'destructive' : 'default'} onClick={() => onClose(true)} autoFocus>
            {options.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
