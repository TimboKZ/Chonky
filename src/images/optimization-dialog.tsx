import { useEffect, useMemo, useState } from 'react'
import { cn } from '../util/cn'
import { formatBytes } from '../util/bytes'
import { Button } from '../ui/primitives/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/primitives/dialog'
import { RESOLUTION_PRESETS, estimateResizedBytes, type ResolutionPreset } from './resize'

export interface ImageOptimizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  oversizedFiles: File[]
  onConfirm: (perFilePresets: Map<File, ResolutionPreset>) => void
  onSkip: () => void
}

export function ImageOptimizationDialog({ open, onOpenChange, oversizedFiles, onConfirm, onSkip }: ImageOptimizationDialogProps) {
  const defaultPreset = RESOLUTION_PRESETS[1]
  const [presets, setPresets] = useState<Map<File, ResolutionPreset>>(new Map())

  useEffect(() => {
    if (open) setPresets(new Map(oversizedFiles.map((file) => [file, defaultPreset])))
    // defaultPreset is a module constant; re-running on it would reset the user's picks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, oversizedFiles])

  const uniformPreset = useMemo(() => {
    const values = [...presets.values()]
    if (values.length === 0) return defaultPreset
    return values.every((preset) => preset.maxDimension === values[0].maxDimension) ? values[0] : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets])

  const totalBefore = oversizedFiles.reduce((sum, file) => sum + file.size, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Optimize image resolution</DialogTitle>
          <DialogDescription>
            {oversizedFiles.length === 1 ? 'This image is' : `These ${oversizedFiles.length} images are`} larger than 2 MB (
            {formatBytes(totalBefore)} total). Resizing keeps uploads fast without a visible quality loss on screen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">Apply to all:</span>
          {RESOLUTION_PRESETS.map((preset) => (
            <button
              key={preset.maxDimension}
              type="button"
              onClick={() => setPresets(new Map(oversizedFiles.map((file) => [file, preset])))}
              className={cn(
                'rounded-md border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                uniformPreset?.maxDimension === preset.maxDimension
                  ? 'border-primary bg-primary/10 font-medium text-primary'
                  : 'border-border hover:border-muted-foreground',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
          {oversizedFiles.map((file, index) => (
            <ImageCard
              key={`${file.name}-${index}`}
              file={file}
              preset={presets.get(file) ?? defaultPreset}
              onPresetChange={(preset) => setPresets((current) => new Map(current).set(file, preset))}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onSkip}>
            Upload originals
          </Button>
          <Button onClick={() => onConfirm(presets)}>Resize & upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ImageCard({
  file,
  preset,
  onPresetChange,
}: {
  file: File
  preset: ResolutionPreset
  onPresetChange: (preset: ResolutionPreset) => void
}) {
  const [src, setSrc] = useState('')
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    // Revoked on unmount: an object URL held for a batch of 4K photos pins their
    // full decoded bytes in memory for as long as the dialog is open.
    return () => URL.revokeObjectURL(url)
  }, [file])

  const estimated = dimensions ? estimateResizedBytes(file.size, dimensions.width, dimensions.height, preset.maxDimension) : null

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border">
      <div className="flex h-32 items-center justify-center overflow-hidden bg-muted">
        {src && (
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
            onLoad={(event) =>
              setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })
            }
          />
        )}
      </div>
      <div className="space-y-1.5 p-2">
        <div className="truncate text-xs font-medium" title={file.name}>
          {file.name}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatBytes(file.size)}</span>
          {estimated !== null && estimated < file.size && (
            <>
              <span aria-hidden>→</span>
              <span className="text-success">~{formatBytes(estimated)}</span>
            </>
          )}
        </div>
        <select
          aria-label={`Resolution for ${file.name}`}
          value={preset.maxDimension}
          onChange={(event) => {
            const found = RESOLUTION_PRESETS.find((candidate) => candidate.maxDimension === Number(event.target.value))
            if (found) onPresetChange(found)
          }}
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {RESOLUTION_PRESETS.map((option) => (
            <option key={option.maxDimension} value={option.maxDimension}>
              {option.label} — {option.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
