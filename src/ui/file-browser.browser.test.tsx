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

  it('does not re-report an unchanged selection when the folder reloads', async () => {
    const onSelectionChange = vi.fn()
    renderBrowser({ onSelectionChange })
    await option('notes.txt').click()
    await vi.waitFor(() => expect(onSelectionChange).toHaveBeenCalled())

    const callsAfterSelect = onSelectionChange.mock.calls.length
    await page.getByRole('button', { name: 'Refresh' }).click()
    await expect.element(option('notes.txt')).toHaveAttribute('aria-selected', 'true')

    // A reload rebuilds the entry array, so notifying on its identity would fire the
    // callback again even though the user's selection never changed.
    expect(onSelectionChange.mock.calls.length).toBe(callsAfterSelect)
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

  it('resizes a details column in the direction the handle is dragged', async () => {
    renderBrowser({ initialViewMode: 'details' })
    const header = page.getByRole('columnheader', { name: /Size/ })
    await expect.element(header).toBeVisible()

    const before = header.element().getBoundingClientRect().width
    const handle = page.getByRole('separator', { name: 'Resize Size column' })
    const box = handle.element().getBoundingClientRect()

    // Dragging the Name/Size boundary to the right gives the space to Name, so the
    // Size column gets narrower — the opposite would move the boundary left while
    // the pointer went right.
    await userEvent.dragAndDrop(handle, page.getByRole('columnheader', { name: /Modified/ }), {
      sourcePosition: { x: box.width / 2, y: box.height / 2 },
      targetPosition: { x: 60, y: 8 },
    })

    await vi.waitFor(() => {
      expect(header.element().getBoundingClientRect().width).toBeLessThan(before)
    })
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

describe('FileBrowser — drag to move', () => {
  /**
   * Native HTML5 drag-and-drop, dispatched by hand.
   *
   * Playwright's dragAndDrop drives mouse events, which never produce `dragstart`
   * / `drop` — the browser only synthesises those for a real OS-level drag. So the
   * test builds one DataTransfer and walks the sequence itself, which is also what
   * exercises the payload contract between dragstart and drop.
   */
  async function dragOnto(sourceName: string, targetName: string) {
    const source = option(sourceName).element()
    const target = option(targetName).element()
    const dataTransfer = new DataTransfer()

    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }))
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }))
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }))
    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }))
  }

  it('moves a dragged file into the folder it is dropped on', async () => {
    const { nodes } = renderBrowser({ initialViewMode: 'list' })
    await option('notes.txt').click()
    await dragOnto('notes.txt', 'Invoices')

    await expect.element(option('notes.txt')).not.toBeInTheDocument()
    const invoices = nodes.find((node) => node.name === 'Invoices')
    expect(invoices?.children?.some((child) => child.name === 'notes.txt')).toBe(true)
  })

  it('moves the whole selection, not just the entry under the cursor', async () => {
    const { nodes } = renderBrowser({ initialViewMode: 'list' })
    await option('budget.xlsx').click()
    await option('notes.txt').click({ modifiers: [MOD] })
    await dragOnto('notes.txt', 'Invoices')

    await vi.waitFor(() => {
      const invoices = nodes.find((node) => node.name === 'Invoices')
      expect(invoices?.children?.map((child) => child.name).sort()).toEqual(['budget.xlsx', 'notes.txt'])
    })
  })

  it('refuses to move an entry the app has locked', async () => {
    const { nodes } = renderBrowser({ initialViewMode: 'list', isEntryLocked: (entry) => entry.name === 'contract.pdf' })
    await option('contract.pdf').click()
    await dragOnto('contract.pdf', 'Invoices')

    await expect.element(option('contract.pdf')).toBeVisible()
    expect(nodes.find((node) => node.name === 'Invoices')?.children).toHaveLength(0)
  })

  it('does not drag at all when drag-and-drop is disabled', async () => {
    const { nodes } = renderBrowser({ initialViewMode: 'list', disableDragAndDrop: true })
    await option('notes.txt').click()
    await expect.element(option('notes.txt')).toHaveAttribute('draggable', 'false')

    await dragOnto('notes.txt', 'Invoices')
    await expect.element(option('notes.txt')).toBeVisible()
    expect(nodes.find((node) => node.name === 'Invoices')?.children).toHaveLength(0)
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

describe('FileBrowser — layout tokens', () => {
  /**
   * Tailwind v4 resolves `max-w-sm` as --max-width-sm → --spacing-sm →
   * --container-sm, so this package's named --spacing-* tokens shadow the
   * container scale unless --max-width-* is defined to win over both. Without it
   * `max-w-sm` collapsed from 24rem to 0.75rem and every dialog rendered as a
   * 12px vertical sliver. Asserting the resolved values keeps that from silently
   * coming back the next time the spacing scale is touched.
   */
  it('resolves the named max-width utilities to their real sizes', async () => {
    renderBrowser()
    await expect.element(option('notes.txt')).toBeVisible()

    const probe = document.createElement('div')
    document.body.appendChild(probe)
    const resolve = (className: string) => {
      probe.className = className
      return getComputedStyle(probe).maxWidth
    }

    try {
      expect(resolve('max-w-xs')).toBe('320px')
      expect(resolve('max-w-sm')).toBe('384px')
      expect(resolve('max-w-lg')).toBe('512px')
      expect(resolve('max-w-2xl')).toBe('672px')
    } finally {
      probe.remove()
    }
  })

  it('gives the create-folder dialog a usable width', async () => {
    renderBrowser()
    await page.getByRole('button', { name: 'New folder' }).click()

    const element = dialog().element()
    const box = element.getBoundingClientRect()
    const styles = getComputedStyle(element)

    expect(box.width).toBeGreaterThan(300)
    // Taller than it is wide is the signature of the collapsed-max-width bug.
    expect(box.width).toBeGreaterThan(box.height)

    // Width alone is not enough: when gui-bytes' own classes failed to compile the
    // dialog kept a sane width but rendered static, unlayered, and below the fold.
    expect(styles.position).toBe('fixed')
    expect(Number(styles.zIndex)).toBeGreaterThan(0)
    expect(box.top).toBeGreaterThanOrEqual(0)
    expect(box.bottom).toBeLessThanOrEqual(window.innerHeight)
  })

  it('gives a toolbar tooltip a usable width', async () => {
    renderBrowser()
    await page.getByRole('radio', { name: 'List view' }).hover()

    // Radix renders a 1x1 visually-hidden duplicate that also carries
    // role="tooltip", so measure the painted content by its slot instead.
    await expect.element(page.getByText('List view').first()).toBeVisible()
    const content = document.querySelector('[data-slot="tooltip-content"]')
    expect(content).not.toBeNull()

    const box = content!.getBoundingClientRect()
    expect(box.width).toBeGreaterThan(box.height)
    expect(box.width).toBeGreaterThan(50)
  })
})

describe('FileBrowser — responsive', () => {
  /** Renders into a fixed-width box, which is what the responsive logic measures. */
  function renderAtWidth(width: number, props: Partial<React.ComponentProps<typeof FileBrowser>> = {}) {
    const adapter = createMemoryAdapter({ tree: tree() })
    render(
      <div style={{ width, height: 600 }}>
        <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} showSidebar={false} {...props} />
      </div>,
    )
  }

  const headers = () => page.getByRole('columnheader')

  it('keeps the details Name column readable on a phone', async () => {
    // The bug this covers: the fixed columns outran the width, so the flexible Name
    // column collapsed to zero and rows showed icons with no filenames at all.
    renderAtWidth(360, { initialViewMode: 'details' })
    await expect.element(option('notes.txt')).toBeVisible()

    const nameCell = option('notes.txt').element().querySelector('div')!
    expect(nameCell.getBoundingClientRect().width).toBeGreaterThan(120)
  })

  it('sheds the lowest-value details columns as the listing narrows', async () => {
    renderAtWidth(360, { initialViewMode: 'details' })
    await expect.element(option('notes.txt')).toBeVisible()

    await expect.element(headers().first()).toHaveTextContent('Name')
    await expect.element(page.getByRole('columnheader', { name: /Type/ })).not.toBeInTheDocument()
    await expect.element(page.getByRole('columnheader', { name: /Modified/ })).not.toBeInTheDocument()
  })

  it('shows every details column when there is room', async () => {
    renderAtWidth(1100, { initialViewMode: 'details' })
    await expect.element(option('notes.txt')).toBeVisible()

    await expect.element(page.getByRole('columnheader', { name: /Type/ })).toBeVisible()
    await expect.element(page.getByRole('columnheader', { name: /Modified/ })).toBeVisible()
  })

  it('never lets the listing scroll sideways', async () => {
    renderAtWidth(360, { initialViewMode: 'details' })
    await expect.element(option('notes.txt')).toBeVisible()

    const listbox = page.getByRole('listbox', { name: 'Files' }).element()
    expect(listbox.scrollWidth).toBeLessThanOrEqual(listbox.clientWidth + 1)
  })

  it('fits more grid tiles per row in a narrow listing', async () => {
    renderAtWidth(360)
    await expect.element(option('notes.txt')).toBeVisible()

    // Narrow listings switch to a smaller tile, so a phone gets three columns
    // rather than two oversized ones.
    const tile = option('notes.txt').element().getBoundingClientRect()
    expect(tile.width).toBeLessThan(130)
  })

  it('keeps the view-mode toggle usable when the toolbar is cramped', async () => {
    // It sat between a fixed-width search box and the icon buttons, and was the
    // thing that got crushed — down to a few pixels with no visible icons.
    renderAtWidth(380)
    await expect.element(option('notes.txt')).toBeVisible()

    for (const name of ['Grid view', 'List view', 'Details view']) {
      const box = page.getByRole('radio', { name }).element().getBoundingClientRect()
      expect(box.width).toBeGreaterThan(20)
      expect(box.height).toBeGreaterThan(20)
    }
  })
})

describe('FileBrowser — filenames', () => {
  function renderNames(width: number) {
    const adapter = createMemoryAdapter({
      tree: [
        { name: 'Cost Breakdown.xlsx', isDir: false, size: 91_800 },
        { name: 'daily-backups.tar.gz', isDir: false, size: 18_400_000 },
        { name: 'Site Survey v1.2 Final (signed).pdf', isDir: false, size: 4_100 },
        { name: '2024.backup', isDir: true, children: [] },
        { name: 'README', isDir: false, size: 120 },
      ],
    })
    render(
      <div style={{ width, height: 560 }}>
        <FileBrowser adapter={adapter} rootLabel="Files" persistKey={false} showSidebar={false} />
      </div>,
    )
  }

  it('keeps the full name as the accessible name even though the tile splits it', async () => {
    // The visible text is stem-only; a screen reader must still hear the extension.
    renderNames(700)
    await expect.element(option('Cost Breakdown\\.xlsx')).toBeVisible()
    await expect.element(option('daily-backups\\.tar\\.gz')).toBeVisible()
  })

  /** Waits for the tile to paint, then hands back its element. */
  async function tileFor(name: string) {
    const locator = option(name)
    await expect.element(locator).toBeVisible()
    return locator.element()
  }

  it('shows the extension on the icon rather than in the name', async () => {
    renderNames(700)
    const tile = await tileFor('Cost Breakdown\\.xlsx')

    expect(tile.textContent).toContain('Cost Breakdown')
    expect(tile.textContent).not.toContain('.xlsx')
    expect(tile.textContent?.toLowerCase()).toContain('xlsx')
  })

  it('keeps a compound extension together on the badge', async () => {
    renderNames(700)
    const tile = await tileFor('daily-backups\\.tar\\.gz')

    expect(tile.textContent).toContain('daily-backups')
    expect(tile.textContent?.toLowerCase()).toContain('tar.gz')
  })

  it('does not mistake a dot inside a name for an extension', async () => {
    renderNames(700)
    const tile = await tileFor('Site Survey')

    expect(tile.textContent).toContain('Site Survey v1.2 Final (signed)')
    expect(tile.textContent?.toLowerCase()).toContain('pdf')
  })

  it('leaves folders and extensionless files whole', async () => {
    renderNames(700)
    // A folder called `2024.backup` is not a `.backup` file.
    expect((await tileFor('2024\\.backup')).textContent).toContain('2024.backup')
    expect((await tileFor('README')).textContent).toContain('README')
  })

  it('shortens by tile width rather than a fixed character count', async () => {
    // The old grid middle-truncated at 34 characters regardless of tile size, so a
    // narrow listing wrapped and clamped instead of shortening.
    renderNames(360)
    const tile = await tileFor('Site Survey')
    const name = tile.querySelector('span')!

    expect(name.scrollHeight).toBeLessThanOrEqual(name.clientHeight + 1)
    expect(tile.getBoundingClientRect().width).toBeLessThan(130)
  })
})

describe('FileBrowser — telling similar names apart', () => {
  /* The names below differ only at the end, which is the case end-truncation
   * destroys: every one of them renders as "Site Survey v1 FIN…". */
  const VERSIONS = [
    'Site Survey v1 FINAL.pdf',
    'Site Survey v1 FINAL-signed.pdf',
    'Site Survey v1 FINAL-signed-rev2.pdf',
    'Site Survey v1 FINAL-signed-rev3.pdf',
  ]

  function renderVersions(
    width: number,
    viewMode: 'grid' | 'list' | 'details',
    extensionDisplay: 'badge' | 'inline' = 'badge',
  ) {
    const adapter = createMemoryAdapter({ tree: VERSIONS.map((name) => ({ name, isDir: false, size: 4_100 })) })
    render(
      <div style={{ width, height: 560 }}>
        <FileBrowser
          adapter={adapter}
          rootLabel="Files"
          persistKey={false}
          showSidebar={false}
          initialViewMode={viewMode}
          extensionDisplay={extensionDisplay}
        />
      </div>,
    )
  }

  /**
   * The text actually painted inside each row.
   *
   * `textContent` is no use here: CSS truncation clips text without removing it,
   * so an end-ellipsised name still reports in full and every assertion passes
   * whether or not the fix is present.
   *
   * Each character is measured against the nearest ancestor that actually clips —
   * not against the row, which is wider and would count overflowing text as
   * visible.
   */
  async function paintedNames() {
    await expect.element(page.getByRole('option').first()).toBeVisible()

    const clipperOf = (node: Node, row: Element): Element => {
      let element = node.parentElement
      while (element && element !== row) {
        const overflowX = getComputedStyle(element).overflowX
        if (overflowX === 'hidden' || overflowX === 'clip') return element
        element = element.parentElement
      }
      return row
    }

    return (await page.getByRole('option').all()).map((locator) => {
      const row = locator.element()
      const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      let painted = ''

      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? ''
        const bounds = clipperOf(node, row).getBoundingClientRect()

        // Character by character: a clipped run is partly visible, and only the
        // part inside the clipping box counts as readable.
        for (let index = 0; index < text.length; index++) {
          range.setStart(node, index)
          range.setEnd(node, index + 1)
          const rect = range.getBoundingClientRect()
          if (rect.width === 0) continue
          // Vertical bounds too: a line-clamped grid tile hides overflow by row,
          // and those characters are laid out below the box rather than beyond it.
          const inside =
            rect.left >= bounds.left - 1 &&
            rect.right <= bounds.right + 1 &&
            rect.top >= bounds.top - 1 &&
            rect.bottom <= bounds.bottom + 1
          if (inside) painted += text[index]
        }
      }
      return painted.replace(/\s+/g, ' ').trim()
    })
  }

  it('keeps the distinguishing tail visible in the list view', async () => {
    // Narrow enough to force truncation: at a comfortable width these names fit
    // whole and the test would prove nothing.
    renderVersions(300, 'list')
    const names = await paintedNames()

    // The core property: four files, four readable rows.
    expect(new Set(names).size).toBe(VERSIONS.length)
    // includes, not endsWith: the painted row also carries the size column.
    for (const tail of ['signed', 'rev2', 'rev3']) {
      expect(names.some((name) => name.includes(tail))).toBe(true)
    }
  })

  it('keeps the distinguishing tail visible in the details view', async () => {
    renderVersions(300, 'details')
    const names = await paintedNames()

    expect(new Set(names).size).toBe(VERSIONS.length)
    expect(names.some((name) => name.includes('rev3'))).toBe(true)
  })

  it('keeps the distinguishing tail visible on a narrow grid tile', async () => {
    // The grid shows the extension on the badge, so the stems have to differ.
    renderVersions(360, 'grid')
    const names = await paintedNames()

    expect(new Set(names).size).toBe(VERSIONS.length)
    for (const suffix of ['rev2', 'rev3']) {
      expect(names.some((name) => name.includes(suffix))).toBe(true)
    }
  })

  it('shows a name that fits without any ellipsis', async () => {
    const adapter = createMemoryAdapter({ tree: [{ name: 'notes.txt', isDir: false, size: 12 }] })
    render(
      <div style={{ width: 620, height: 400 }}>
        <FileBrowser
          adapter={adapter}
          rootLabel="Files"
          persistKey={false}
          showSidebar={false}
          initialViewMode="list"
          extensionDisplay="inline"
        />
      </div>,
    )
    const names = await paintedNames()
    expect(names[0]).toContain('notes.txt')
    expect(names[0]).not.toContain('…')
  })

  it('holds the extension apart from the name in the row views', async () => {
    renderVersions(600, 'list')
    const names = await paintedNames()

    // The badge carries the type; the name itself no longer ends in `.pdf`.
    expect(names.some((name) => name.includes('Site Survey v1 FINAL'))).toBe(true)
    expect(names.some((name) => name.toLowerCase().includes('pdf'))).toBe(true)
    expect(names.every((name) => !name.includes('.pdf'))).toBe(true)
  })

  it('leaves the extension in the name when asked to', async () => {
    renderVersions(600, 'list', 'inline')
    const names = await paintedNames()

    expect(names.some((name) => name.includes('Site Survey v1 FINAL.pdf'))).toBe(true)
  })

  it('still truncates in the middle with the extension inline', async () => {
    // Turning the badge off must not turn end-truncation back on.
    renderVersions(300, 'list', 'inline')
    const names = await paintedNames()

    expect(new Set(names).size).toBe(VERSIONS.length)
    expect(names.some((name) => name.includes('rev3.pdf'))).toBe(true)
  })
})
