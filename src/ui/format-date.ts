const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function formatDate(epochMs: number | undefined | null): string {
  if (!epochMs) return '—'
  return dateFormat.format(new Date(epochMs))
}

export function formatDateTime(epochMs: number | undefined | null): string {
  if (!epochMs) return '—'
  return dateTimeFormat.format(new Date(epochMs))
}
