/**
 * Picks a directory name that doesn't collide with `taken`, appending " (2)",
 * " (3)", … as needed.
 *
 * Directories can't reuse the shared `uniqueName`: that splits on "." to preserve
 * an extension, and an extensionless folder called `2024.backup` would be treated
 * as stem `2024` with extension `backup`.
 */
export function getDirectoryName(name: string, taken: string[]): string {
  const used = new Set(taken)
  if (!used.has(name)) return name

  const base = name.replace(/ \(\d+\)$/, '')
  let suffix = 2
  while (used.has(`${base} (${suffix})`)) suffix++
  return `${base} (${suffix})`
}
