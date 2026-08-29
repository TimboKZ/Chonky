import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from '@vitest/browser/context'
import { FileBrowser } from './file-browser'
import { createMemoryAdapter, type MemoryNode } from '../adapter/memory-adapter'
import { FileActionId } from '../core/actions'

/** ⌘ on macOS, Ctrl elsewhere. `process` does not exist in the browser runner. */
const MOD = navigator.platform.includes('Mac') ? 'Meta' : 'Control'

/**
 * Display order for the fixture: directories first, then files, each by name.
 * Several assertions below depend on it, so it is spelled out once here.
 */
const ORDER = ['Invoices', 'Photos', 'budget.xlsx', 'contract.pdf', 'notes.txt']

function tree(): MemoryNode[] {
  return [
    { name: 'Photos', isDir: true, modifiedAt: Date.parse('2026-01-01'), children: [{ name: 'beach.jpg', isDir: false, size: 2048, mimeType: 'image/jpeg' }] },
    { name: 'Invoices', isDir: true, modifiedAt: Date.parse('2026-02-01'), children: [] },
    { name: 'notes.txt', isDir: false, size: 120, mimeType: 'text/plain', modifiedAt: Date.parse('2026-03-01') },
    { name: 'budget.xlsx', isDir: false, size: 8192, modifiedAt: Date.parse('2026-03-02') },
    { name: 'contract.pdf', isDir: false, size: 40960, mimeType: 'application/pdf', modifiedAt: Date.parse('2026-03-03') },
  ]
}

function renderBrowser(props: Partial<React.ComponentProps<typeof FileBrowser>> = {}) {
  const nodes = tree()
  const adapter = createMemoryAdapter({ tree: nodes })
  const screen = render(
    <div style={{ height: 600, width: 900 }}>
      <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} {...props} />
    </div>,
  )
  return { screen, adapter, nodes }
}

const option = (name: string) => page.getByRole('option', { name: new RegExp(name, 'i') })

/** Role `name` matching is a substring match, so "Files" would also hit the toolbar's
 * "Upload files" and the tree's "Collapse Files". Scope crumbs to their own nav. */
const crumb = (name: string) => page.getByRole('navigation', { name: 'Folder path' }).getByRole('button', { name, exact: true })

const dialog = () => page.getByRole('dialog')

beforeEach(() => {
  // View preferences are keyed per adapter; `persistKey={false}` opts out, but any
  // stray key from an earlier run would still skew a density assertion.
  localStorage.clear()
})

describe('FileBrowser — rendering', () => {
  it('lists the root folder with folders before files', async () => {
    renderBrowser()
    await expect.element(option('Photos')).toBeVisible()

    const names = (await page.getByRole('option').all()).map((el) => el.element().getAttribute('title'))
    expect(names).toEqual(ORDER)
  })

  it('exposes the listing as a multi-selectable listbox', async () => {
    renderBrowser()
    const listbox = page.getByRole('listbox', { name: 'Files' })
    await expect.element(listbox).toBeVisible()
    await expect.element(listbox).toHaveAttribute('aria-multiselectable', 'true')
  })

  it('shows an empty state for a folder with nothing in it', async () => {
    renderBrowser()
    await option('Invoices').dblClick()
    await expect.element(page.getByText('This folder is empty.')).toBeVisible()
  })

  it('reports counts in the status bar', async () => {
    renderBrowser()
    await expect.element(page.getByText('2 folders · 3 files')).toBeVisible()
  })
})

describe('FileBrowser — selection', () => {
  it('selects a single entry on click and replaces it on the next', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await expect.element(option('notes.txt')).toHaveAttribute('aria-selected', 'true')

    await option('contract.pdf').click()
    await expect.element(option('notes.txt')).toHaveAttribute('aria-selected', 'false')
    await expect.element(option('contract.pdf')).toHaveAttribute('aria-selected', 'true')
  })

  it('extends the selection over a range with shift', async () => {
    renderBrowser()
    await option('budget.xlsx').click()
    await option('notes.txt').click({ modifiers: ['Shift'] })

    await expect.element(page.getByText('3 selected')).toBeVisible()
  })

  it('adds a discontiguous entry with the platform modifier', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await option('contract.pdf').click({ modifiers: [MOD] })

    await expect.element(page.getByText('2 selected')).toBeVisible()
  })

  it('clears the selection when the empty space around the entries is clicked', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await expect.element(page.getByText('1 selected')).toBeVisible()

    // Below the single row of tiles, but still inside the listbox's own box.
    await page.getByRole('listbox', { name: 'Files' }).click({ position: { x: 5, y: 380 } })
    await expect.element(page.getByText('2 folders · 3 files')).toBeVisible()
  })

  it('reports the selection to the host app', async () => {
    const onSelectionChange = vi.fn()
    renderBrowser({ onSelectionChange })
    await option('notes.txt').click()

    await vi.waitFor(() => {
      const last = onSelectionChange.mock.calls.at(-1)?.[0]
      expect(last?.map((entry: { name: string }) => entry.name)).toEqual(['notes.txt'])
    })
  })
})

describe('FileBrowser — keyboard', () => {
  it('moves focus one row at a time in the list view', async () => {
    renderBrowser({ initialViewMode: 'list' })
    await option('Invoices').click()

    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option('Photos')).toHaveAttribute('aria-selected', 'true')
    await expect.element(option('Invoices')).toHaveAttribute('aria-selected', 'false')
  })

  it('moves one tile at a time across a grid row', async () => {
    // ArrowDown in the grid moves a whole row, so sideways movement is ArrowRight.
    renderBrowser()
    await option('Invoices').click()

    await userEvent.keyboard('{ArrowRight}')
    await expect.element(option('Photos')).toHaveAttribute('aria-selected', 'true')
  })

  it('extends a range with shift and the arrow keys', async () => {
    renderBrowser({ initialViewMode: 'list' })
    await option('Invoices').click()
    await userEvent.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')

    await expect.element(page.getByText('3 selected')).toBeVisible()
  })

  it('jumps to the ends with Home and End', async () => {
    renderBrowser({ initialViewMode: 'list' })
    await option('Photos').click()

    await userEvent.keyboard('{End}')
    await expect.element(option('notes.txt')).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Home}')
    await expect.element(option('Invoices')).toHaveAttribute('aria-selected', 'true')
  })

  it('selects everything with the select-all shortcut', async () => {
    renderBrowser()
    await option('Photos').click()
    await userEvent.keyboard(`{${MOD}>}a{/${MOD}}`)

    await expect.element(page.getByText('5 selected')).toBeVisible()
  })

  it('clears the selection on Escape', async () => {
    renderBrowser()
    await option('Photos').click()
    await userEvent.keyboard('{Escape}')

    await expect.element(page.getByText('2 folders · 3 files')).toBeVisible()
  })

  it('opens a folder with Enter', async () => {
    renderBrowser()
    await option('Photos').click()
    await userEvent.keyboard('{Enter}')

    await expect.element(option('beach.jpg')).toBeVisible()
  })

  it('keeps exactly one entry tabbable, so Tab leaves the listing', async () => {
    renderBrowser()
    await expect.element(option('Photos')).toBeVisible()

    const tabbable = (await page.getByRole('option').all()).filter((el) => el.element().getAttribute('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
  })
})

describe('FileBrowser — navigation', () => {
  it('opens a folder on double-click and updates the breadcrumbs', async () => {
    renderBrowser()
    await option('Photos').dblClick()

    await expect.element(option('beach.jpg')).toBeVisible()
    await expect.element(crumb('Photos')).toBeVisible()
  })

  it('walks back up through a breadcrumb', async () => {
    renderBrowser()
    await option('Photos').dblClick()
    await expect.element(option('beach.jpg')).toBeVisible()

    await crumb('Files').click()
    await expect.element(option('contract.pdf')).toBeVisible()
  })

  it('walks back up with the toolbar control, which is disabled at the root', async () => {
    renderBrowser()
    const up = page.getByRole('button', { name: 'Up one folder' })
    await expect.element(up).toBeDisabled()

    await option('Photos').dblClick()
    await expect.element(option('beach.jpg')).toBeVisible()
    await up.click()
    await expect.element(option('contract.pdf')).toBeVisible()
  })

  it('drops the selection when the folder changes', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await option('Photos').dblClick()

    await expect.element(option('beach.jpg')).toBeVisible()
    await expect.element(page.getByText('0 folders · 1 file')).toBeVisible()
  })
})

describe('FileBrowser — views and search', () => {
  it('switches between the three views', async () => {
    renderBrowser()
    await page.getByRole('radio', { name: 'Details view' }).click()
    await expect.element(page.getByRole('columnheader', { name: /Name/ })).toBeVisible()

    await page.getByRole('radio', { name: 'List view' }).click()
    await expect.element(page.getByRole('columnheader', { name: /Name/ })).not.toBeInTheDocument()
    await expect.element(option('notes.txt')).toBeVisible()
  })

  it('sorts by a details column and flips direction on a second click', async () => {
    renderBrowser({ initialViewMode: 'details' })
    const header = page.getByRole('button', { name: /^Name/ })

    await header.click()
    await expect.element(page.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')

    await header.click()
    await expect.element(page.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('filters the listing as the user types', async () => {
    renderBrowser()
    await page.getByRole('searchbox', { name: 'Search this folder' }).fill('contract')

    await expect.element(option('contract.pdf')).toBeVisible()
    await expect.element(option('notes.txt')).not.toBeInTheDocument()
  })

  it('shows a distinct empty state when a search matches nothing', async () => {
    renderBrowser()
    await page.getByRole('searchbox', { name: 'Search this folder' }).fill('zzzz')
    await expect.element(page.getByText('No files match your search.')).toBeVisible()
  })
})

describe('FileBrowser — actions', () => {
  it('renames through the prompt dialog and reloads the listing', async () => {
    const { nodes } = renderBrowser()
    await option('notes.txt').click()
    await userEvent.keyboard('{F2}')

    const input = dialog().getByRole('textbox')
    await expect.element(input).toBeVisible()
    await input.fill('renamed.txt')
    await dialog().getByRole('button', { name: 'Rename' }).click()

    await expect.element(option('renamed.txt')).toBeVisible()
    expect(nodes.some((node) => node.name === 'renamed.txt')).toBe(true)
  })

  it('rejects an illegal name in the rename dialog before it reaches the backend', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await userEvent.keyboard('{F2}')

    const input = dialog().getByRole('textbox')
    await input.fill('bad/name.txt')

    await expect.element(input).toHaveAttribute('aria-invalid', 'true')
    // The accessible description is the real contract: a screen-reader user has to
    // hear *why* the name was rejected, not just that the field is invalid.
    await expect.element(input).toHaveAccessibleDescription('Name contains illegal characters')
    await expect.element(dialog().getByRole('button', { name: 'Rename' })).toBeDisabled()
  })

  it('asks before deleting, and removes the entry once confirmed', async () => {
    const { nodes } = renderBrowser()
    await option('notes.txt').click()
    await userEvent.keyboard('{Delete}')

    await expect.element(page.getByRole('alertdialog')).toBeVisible()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click()

    await expect.element(option('notes.txt')).not.toBeInTheDocument()
    expect(nodes.some((node) => node.name === 'notes.txt')).toBe(false)
  })

  it('leaves the entry alone when the delete is cancelled', async () => {
    renderBrowser()
    await option('notes.txt').click()
    await userEvent.keyboard('{Delete}')
    await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click()

    await expect.element(option('notes.txt')).toBeVisible()
  })

  it('creates a folder through the toolbar', async () => {
    renderBrowser()
    await page.getByRole('button', { name: 'New folder' }).click()

    await dialog().getByRole('textbox').fill('Receipts')
    await dialog().getByRole('button', { name: 'Create' }).click()

    await expect.element(option('Receipts')).toBeVisible()
  })

  it('hands the action to the host app before running its own behaviour', async () => {
    const onFileAction = vi.fn()
    renderBrowser({ onFileAction })

    await option('notes.txt').click()
    await userEvent.keyboard('{F2}')

    await vi.waitFor(() => {
      expect(onFileAction).toHaveBeenCalledWith(expect.objectContaining({ id: FileActionId.Rename }))
    })
  })

  it('suppresses the built-in behaviour when the app calls preventDefault', async () => {
    renderBrowser({
      onFileAction: (event) => {
        if (event.id === FileActionId.Rename) event.preventDefault()
      },
    })

    await option('notes.txt').click()
    await userEvent.keyboard('{F2}')

    // The dialog is the built-in behaviour; suppressing it must leave nothing open.
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('FileBrowser — permissions', () => {
  it('hides every mutating action in read-only mode', async () => {
    renderBrowser({ readOnly: true })
    await expect.element(option('notes.txt')).toBeVisible()

    await expect.element(page.getByRole('button', { name: 'New folder' })).not.toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Upload files' })).not.toBeInTheDocument()
  })

  it('ignores a mutating hotkey in read-only mode', async () => {
    renderBrowser({ readOnly: true })
    await option('notes.txt').click()
    await userEvent.keyboard('{Delete}')

    await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument()
    await expect.element(option('notes.txt')).toBeVisible()
  })

  it('hides actions the adapter cannot service', async () => {
    const adapter = createMemoryAdapter({ tree: tree(), writable: false })
    render(
      <div style={{ height: 600, width: 900 }}>
        <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} />
      </div>,
    )
    await expect.element(option('notes.txt')).toBeVisible()

    // The read-only memory adapter implements `list` and nothing else.
    await expect.element(page.getByRole('button', { name: 'New folder' })).not.toBeInTheDocument()
  })

  it('will not delete an entry the app has locked', async () => {
    renderBrowser({ isEntryLocked: (entry) => entry.name === 'contract.pdf' })
    await option('contract.pdf').click()
    await userEvent.keyboard('{Delete}')

    await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument()
    await expect.element(option('contract.pdf')).toBeVisible()
  })
})
