import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from '@vitest/browser/context'
import { ChonkyActions, FileHelper, defineFileAction } from './actions'
import { ChonkyIconName } from './icons'
import { FullFileBrowser, setChonkyDefaults } from './full-file-browser'
import type { ChonkyFileActionData, ChonkyFileArray } from './types'

/* The shapes below mirror what the gui-bytes wrapper actually passed Chonky:
 * `modDate` as epoch ms, and a display-shortened `name` alongside the real
 * `fullName`. */
const files: ChonkyFileArray = [
  { id: 'dir-1', name: 'Photos', isDir: true, fullName: 'Photos' },
  { id: 'file-1', name: 'a-really ... -name.pdf', fullName: 'a-really-very-long-name.pdf', size: 2048, modDate: Date.parse('2026-01-01') },
  { id: 'file-2', name: 'notes.txt', fullName: 'notes.txt', size: 64 },
  null, // Chonky used a null slot for a file that had not loaded yet.
]

const folderChain: ChonkyFileArray = [{ id: 'root', name: 'Job 1234 Files', isDir: true }]

const RenameAction = defineFileAction({
  id: 'renameFile',
  requiresSelection: true,
  button: { name: 'Rename', contextMenu: true, group: 'Actions', icon: ChonkyIconName.text },
})

const DeleteAction = defineFileAction({
  id: 'deleteFiles',
  hotkeys: ['ctrl+d', 'command+d'],
  fileFilter: (file) => !file?.isDir,
  requiresSelection: true,
  button: { name: 'Delete', contextMenu: true, icon: ChonkyIconName.trash },
})

function renderCompat(onFileAction = vi.fn()) {
  render(
    <div style={{ height: 600, width: 900 }}>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={[ChonkyActions.UploadFiles, RenameAction, DeleteAction]}
        onFileAction={onFileAction}
        defaultFileViewActionId="enable_list_view"
      />
    </div>,
  )
  return onFileAction
}

const lastCall = (handler: ReturnType<typeof vi.fn>, id: string): ChonkyFileActionData | undefined =>
  handler.mock.calls.map((call) => call[0] as ChonkyFileActionData).findLast((data) => data.id === id)

describe('chonky-compat FullFileBrowser', () => {
  it('renders the files it was given and skips the null placeholder', async () => {
    renderCompat()
    await expect.element(page.getByRole('option', { name: /Photos/ })).toBeVisible()
    expect(await page.getByRole('option').all()).toHaveLength(3)
  })

  it('shows the real name, not the display-shortened one', async () => {
    // The wrapper stored a truncated name in `name`; a mutation carrying that would
    // create a file literally called "a-really ... -name.pdf".
    renderCompat()
    await expect.element(page.getByRole('option', { name: /a-really-very-long-name\.pdf/ })).toBeVisible()
  })

  it('forwards a selection change in Chonky event shape', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /notes\.txt/ }).click()

    await vi.waitFor(() => {
      const data = lastCall(onFileAction, 'change_selection')
      expect(data?.state.selectedFiles.map((file) => file.id)).toEqual(['file-2'])
    })
  })

  it('hands back the original file object, so custom fields survive the round trip', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /notes\.txt/ }).click()

    await vi.waitFor(() => {
      const data = lastCall(onFileAction, 'change_selection')
      expect(data?.state.selectedFiles[0]).toBe(files[2])
    })
  })

  it('emits open_files with the payload shape a handler destructures', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /Photos/ }).dblClick()

    await vi.waitFor(() => {
      const data = lastCall(onFileAction, 'open_files')
      expect(data?.payload.targetFile?.id).toBe('dir-1')
      expect(FileHelper.isDirectory(data!.payload.targetFile)).toBe(true)
    })
  })

  it('does not navigate on its own — the app owns the folder contents', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /Photos/ }).dblClick()

    await vi.waitFor(() => expect(lastCall(onFileAction, 'open_files')).toBeDefined())
    // `files` never changed, so the same listing must still be on screen.
    await expect.element(page.getByRole('option', { name: /notes\.txt/ })).toBeVisible()
  })

  it('narrows the action to the files its fileFilter accepts', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /Photos/ }).click()
    await page.getByRole('option', { name: /notes\.txt/ }).click({ modifiers: ['Shift'] })

    await userEvent.keyboard(`{${navigator.platform.includes('Mac') ? 'Meta' : 'Control'}>}d{/${navigator.platform.includes('Mac') ? 'Meta' : 'Control'}}`)

    await vi.waitFor(() => {
      const data = lastCall(onFileAction, 'deleteFiles')
      expect(data?.state.selectedFiles).toHaveLength(3)
      // The folder is excluded by the filter, but still reported as selected.
      expect(data?.state.selectedFilesForAction.map((file) => file.id)).toEqual(['file-1', 'file-2'])
    })
  })

  it('translates a ctrl hotkey so it fires on the platform modifier', async () => {
    const onFileAction = renderCompat()
    await page.getByRole('option', { name: /notes\.txt/ }).click()
    await userEvent.keyboard(`{${navigator.platform.includes('Mac') ? 'Meta' : 'Control'}>}d{/${navigator.platform.includes('Mac') ? 'Meta' : 'Control'}}`)

    await vi.waitFor(() => expect(lastCall(onFileAction, 'deleteFiles')).toBeDefined())
  })

  it('renders a toolbar button from the action button config', async () => {
    renderCompat()
    await expect.element(page.getByRole('button', { name: 'Upload files' })).toBeVisible()
  })

  it('accepts setChonkyDefaults without throwing', () => {
    expect(() => setChonkyDefaults({ iconComponent: () => null, disableDragAndDrop: true })).not.toThrow()
  })
})

describe('FileHelper', () => {
  it('answers the predicates apps used inside their action filters', () => {
    expect(FileHelper.isDirectory({ isDir: true })).toBe(true)
    expect(FileHelper.isDirectory(null)).toBe(false)
    expect(FileHelper.isHidden({ name: '.env' })).toBe(true)
    expect(FileHelper.isDroppable({ isDir: true })).toBe(true)
    expect(FileHelper.isDroppable({ isDir: false })).toBe(false)
    expect(FileHelper.getItemSize({ size: 12 })).toBe(12)
  })
})
