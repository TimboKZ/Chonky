import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { FsgFileBrowser } from './fsg-file-browser'
import { FsgPreviewPanel } from './fsg-preview-panel'
import { DevSessionGate, useDevSession } from './dev-session'
import type { FileItem } from './types'

/*
 * These stories talk to the real file-storage service. Copy `.env.example` to
 * `.env.local` and set an area and entity you have files under; everything else
 * defaults to dev. Auth is your `fsg_apps_session` cookie — the story checks for
 * one and offers a sign-in link before it tries to load anything.
 *
 * Area and entity are also editable in the Controls panel, so you can point a
 * story somewhere else without restarting Storybook.
 */
const env = import.meta.env

const DEFAULTS = {
  baseUrl: (env.VITE_API_GATEWAY_BASE_URL as string) || 'https://api.dev.fsgapps.com',
  identityServiceUrl: (env.VITE_IDENTITY_SERVICE_URL as string) || 'https://identity.dev.fsgapps.com',
  area: (env.VITE_FILE_STORAGE_AREA as string) || 'engage-v2',
  // `/` opens the area root, which lists every entity folder in it — so the stories
  // work without knowing an entity id up front. Narrow it to one folder by setting
  // VITE_FILE_STORAGE_ROOT_PATH, or by typing a path into the Controls panel.
  rootPath: (env.VITE_FILE_STORAGE_ROOT_PATH as string) || (env.VITE_FILE_STORAGE_ENTITY_ID as string) || '/',
}

interface DevArgs {
  baseUrl: string
  identityServiceUrl: string
  area: string
  rootPath: string
  readOnly: boolean
  showPreviewPanel: boolean
  initialViewMode: 'icon' | 'list' | 'details'
}

/** Label for the root crumb: the folder being browsed, or the area at its root. */
const labelFor = (area: string, rootPath: string) => rootPath.split('/').filter(Boolean).pop() || area

function DevBrowser({ area, rootPath, baseUrl, identityServiceUrl, ...rest }: DevArgs) {
  const session = useDevSession({ identityServiceUrl })
  const [previewFile, setPreviewFile] = useState<FileItem | undefined>()
  const label = labelFor(area, rootPath)

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full flex-col gap-2">
      {/* Storybook has no toast host of its own, and the browser routes every
          message — upload failures, locked items, HEIC fallbacks — through sonner. */}
      <Toaster position="bottom-right" richColors />

      {!area ? (
        <MissingConfig />
      ) : (
        <DevSessionGate
          state={session.state}
          identityServiceUrl={identityServiceUrl}
          onRetry={session.recheck}
          onSignIn={session.signIn}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <p className="shrink-0 text-xs text-muted-foreground">
              {session.user?.email ? `Signed in as ${session.user.email} · ` : ''}
              <span className="font-mono">{area}</span>
              <span className="font-mono">{rootPath === '/' ? '' : `/${rootPath.replace(/^\/+/, '')}`}</span> on{' '}
              <span className="font-mono">{baseUrl}</span>
            </p>
            <div className="min-h-0 flex-1">
              <FsgFileBrowser
                // Remounts when the target changes: the browser loads its root once
                // on mount, so a new area or path needs a fresh instance.
                key={`${baseUrl}:${area}:${rootPath}`}
                entityId={label}
                rootPath={rootPath}
                apiConfig={{ baseUrl, area }}
                title={label}
                setPreviewFile={setPreviewFile}
                {...rest}
              />
            </div>
          </div>
        </DevSessionGate>
      )}
      {/* Referenced so the preview file state is meaningful in the split story. */}
      <span className="hidden">{previewFile?.name}</span>
    </div>
  )
}

function MissingConfig() {
  return (
    <div className="fsg-fb-surface flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-8 text-center">
      <p className="text-sm font-medium">Point this at an area first</p>
      <p className="max-w-lg text-xs text-muted-foreground">
        Set <code>VITE_FILE_STORAGE_AREA</code> in <code>.env.local</code> (copy <code>.env.example</code>), or type one into the
        Controls panel below.
      </p>
    </div>
  )
}

const meta = {
  title: 'File Browser/Dev file storage',
  component: DevBrowser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reads the live FSG file-storage service using your `fsg_apps_session` cookie. ' +
          'Everything here writes to real storage — deletes archive under `/Archive`, uploads land in the folder shown.',
      },
    },
  },
  argTypes: {
    area: { control: 'text', description: 'Storage area, e.g. engage-v2 or fsgone-workorders' },
    rootPath: { control: 'text', description: '“/” browses the whole area; a path opens one entity folder' },
    baseUrl: { control: 'text' },
    identityServiceUrl: { control: 'text' },
    initialViewMode: { control: 'radio', options: ['icon', 'list', 'details'] },
  },
  args: {
    ...DEFAULTS,
    readOnly: false,
    showPreviewPanel: false,
    initialViewMode: 'icon' as const,
  },
} satisfies Meta<typeof DevBrowser>

export default meta
type Story = StoryObj<typeof meta>

/** Live storage, fully interactive. Uploads, renames and deletes are real. */
export const Live: Story = {}

/**
 * Live storage with every mutating action hidden — the safe one to open if you
 * just want to look at what is really in a folder.
 */
export const LiveReadOnly: Story = {
  args: { readOnly: true },
}

export const LiveWithPreview: Story = {
  args: { showPreviewPanel: true, initialViewMode: 'list' },
}

export const LiveDetails: Story = {
  args: { initialViewMode: 'details' },
}

/** The preview panel on its own, driven by the selection — as meetings renders it. */
export const LivePreviewPanel: Story = {
  render: function Render(args) {
    const session = useDevSession({ identityServiceUrl: args.identityServiceUrl })
    const [file, setFile] = useState<FileItem | undefined>()

    if (!args.area) return <MissingConfig />

    return (
      <DevSessionGate
        state={session.state}
        identityServiceUrl={args.identityServiceUrl}
        onRetry={session.recheck}
        onSignIn={session.signIn}
      >
        <div className="flex h-[calc(100vh-2rem)] gap-2">
          <div className="min-w-0 flex-1">
            <FsgFileBrowser
              entityId={labelFor(args.area, args.rootPath)}
              rootPath={args.rootPath}
              apiConfig={{ baseUrl: args.baseUrl, area: args.area }}
              title={labelFor(args.area, args.rootPath)}
              initialViewMode="list"
              setPreviewFile={setFile}
            />
          </div>
          <div className="w-96 shrink-0 rounded-lg border border-border">
            <FsgPreviewPanel file={file} apiConfig={{ baseUrl: args.baseUrl, area: args.area }} />
          </div>
        </div>
      </DevSessionGate>
    )
  },
}
