import { describe, expect, it, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from '@vitest/browser/context'
import { FileBrowser } from '../ui/file-browser'
import { FilePreviewPanel } from './preview-panel'
import { createMemoryAdapter, type MemoryNode } from '../adapter/memory-adapter'

const CSV = 'Item,Status\n1,Open\n2,Complete'

function tree(): MemoryNode[] {
  return [
    { name: 'punch-list.csv', isDir: false, mimeType: 'text/csv', content: CSV },
    { name: 'notes.txt', isDir: false, mimeType: 'text/plain', content: 'Site visit notes' },
    // No content: the fixture equivalent of a backend that cannot serve the bytes.
    { name: 'budget.xlsx', isDir: false, size: 91_800 },
  ]
}

function renderWithPanel(options: { servesContent?: boolean } = {}) {
  const adapter = createMemoryAdapter({ tree: tree(), servesContent: options.servesContent ?? true })
  render(
    <div style={{ height: 600, width: 1100 }}>
      <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} aside={<FilePreviewPanel />} />
    </div>,
  )
}

const option = (name: string) => page.getByRole('option', { name: new RegExp(name, 'i') })
const panel = () => page.getByRole('complementary', { name: 'File details' })

beforeEach(() => localStorage.clear())

describe('FilePreviewPanel', () => {
  it('prompts for a selection before one is made', async () => {
    renderWithPanel()
    await expect.element(panel().getByText('Select a file to see its details.')).toBeVisible()
  })

  it('renders a CSV through its viewer', async () => {
    renderWithPanel()
    await option('punch-list.csv').click()

    await expect.element(panel().getByText('Complete')).toBeVisible()
    await expect.element(panel().getByText('punch-list.csv')).toBeVisible()
  })

  it('shows the file’s metadata alongside the preview', async () => {
    renderWithPanel()
    await option('notes.txt').click()

    // The header shows kind and size together; the definition list repeats them as
    // rows, so match the row exactly rather than the combined header line.
    await expect.element(panel().getByText('Text · 16 bytes')).toBeVisible()
    await expect.element(panel().getByText('16 bytes', { exact: true })).toBeVisible()
  })

  it('offers Open and Download when the adapter can produce URLs', async () => {
    renderWithPanel()
    await option('notes.txt').click()

    await expect.element(panel().getByRole('link', { name: 'Open in a new tab' })).toBeVisible()
    await expect.element(panel().getByRole('link', { name: 'Download' })).toBeVisible()
  })

  it('explains itself instead of going blank when the file has no content', async () => {
    // Rendering null here left an empty white panel with no explanation and no way
    // to reach the file — the bug this covers.
    renderWithPanel()
    await option('budget.xlsx').click()

    await expect.element(panel().getByText(/has no content in this fixture/)).toBeVisible()
  })

  it('explains itself when the backend cannot serve content at all', async () => {
    renderWithPanel({ servesContent: false })
    await option('punch-list.csv').click()

    await expect.element(panel().getByText('This file can’t be previewed here.')).toBeVisible()
    await expect.element(panel().getByRole('link', { name: 'Open' })).not.toBeInTheDocument()
  })
})

describe('Preview action gating', () => {
  it('is offered when the adapter can serve content', async () => {
    renderWithPanel()
    await option('punch-list.csv').click({ button: 'right' })
    await expect.element(page.getByRole('menuitem', { name: 'Preview' })).toBeVisible()
  })

  it('is hidden when the adapter can neither read nor open', async () => {
    renderWithPanel({ servesContent: false })
    await option('punch-list.csv').click({ button: 'right' })

    // Rename anchors the assertion: it proves the menu opened, so a missing Preview
    // means it was filtered out rather than that nothing rendered.
    await expect.element(page.getByRole('menuitem', { name: 'Rename' })).toBeVisible()
    await expect.element(page.getByRole('menuitem', { name: 'Preview' })).not.toBeInTheDocument()
  })

  it('is not offered for a file type no viewer handles', async () => {
    const adapter = createMemoryAdapter({ tree: [{ name: 'firmware.bin', isDir: false, content: 'x' }] })
    render(
      <div style={{ height: 600, width: 1100 }}>
        <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} />
      </div>,
    )
    await option('firmware.bin').click({ button: 'right' })

    await expect.element(page.getByRole('menuitem', { name: 'Preview' })).toBeDisabled()
  })
})
