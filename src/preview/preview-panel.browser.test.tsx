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
      <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
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

describe('FilePreviewPanel — narrow layout', () => {
  /** A browser embedded in a narrow box, the way meetings renders it. */
  function renderNarrow(width: number) {
    const adapter = createMemoryAdapter({ tree: tree() })
    render(
      <div style={{ width: 900, height: 600, padding: 8 }}>
        <div style={{ width, height: 560 }}>
          <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
        </div>
      </div>,
    )
  }

  it('stays out of the way until a file is chosen', async () => {
    renderNarrow(380)
    await expect.element(option('punch-list.csv')).toBeVisible()

    // Queried through the DOM rather than a locator: the panel is present but
    // display:none, and an element locator treats that as "not found" and throws
    // instead of reporting it as not visible.
    const aside = document.querySelector('[aria-label="File details"]')
    expect(aside).not.toBeNull()
    expect(getComputedStyle(aside!).display).toBe('none')
  })

  it('covers the listing rather than squeezing it', async () => {
    renderNarrow(380)
    await option('punch-list.csv').click()
    await expect.element(panel()).toBeVisible()

    // The failure mode this replaces: a 320px sidebar beside a 380px browser left
    // the listing a ~55px sliver.
    const box = panel().element().getBoundingClientRect()
    expect(box.width).toBeGreaterThan(300)
  })

  it('stays inside the browser instead of taking over the page', async () => {
    // `fixed` positions against the viewport, so an embedded browser would throw
    // its preview across the whole window.
    renderNarrow(380)
    await option('punch-list.csv').click()
    await expect.element(panel()).toBeVisible()

    const box = panel().element().getBoundingClientRect()
    expect(box.width).toBeLessThanOrEqual(380)
    expect(box.right).toBeLessThanOrEqual(400)
  })

  it('sits beside the listing when there is room', async () => {
    renderNarrow(880)
    await option('punch-list.csv').click()
    await expect.element(panel()).toBeVisible()

    const panelBox = panel().element().getBoundingClientRect()
    const listbox = page.getByRole('listbox', { name: 'Files' }).element().getBoundingClientRect()
    expect(panelBox.width).toBeLessThan(400)
    // Side by side, not stacked.
    expect(listbox.right).toBeLessThanOrEqual(panelBox.left + 1)
  })
})

describe('FilePreviewPanel — chrome', () => {
  it('draws no border of its own when standalone', async () => {
    // It cannot know its container's corner radius, so a border here runs straight
    // past a rounded corner and leaves a seam. The container owns its chrome.
    const adapter = createMemoryAdapter({ tree: tree() })
    render(
      <div style={{ width: 380, height: 400, borderRadius: 12, border: '1px solid #ccc', overflow: 'hidden' }}>
        <FilePreviewPanel entry={{ id: 'a', name: 'punch-list.csv', isDir: false, path: '' }} adapter={adapter} />
      </div>,
    )
    await expect.element(panel()).toBeVisible()

    const styles = getComputedStyle(panel().element())
    expect(styles.borderLeftWidth).toBe('0px')
    expect(styles.borderRightWidth).toBe('0px')
  })

  it('keeps a separator when it sits beside the listing inside a browser', async () => {
    // There it *is* the chrome: nothing else divides the panel from the listing.
    const adapter = createMemoryAdapter({ tree: tree() })
    render(
      <div style={{ width: 900, height: 500 }}>
        <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
      </div>,
    )
    await option('punch-list.csv').click()
    await expect.element(panel()).toBeVisible()

    expect(getComputedStyle(panel().element()).borderLeftWidth).toBe('1px')
  })
})
