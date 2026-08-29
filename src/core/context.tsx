import { createContext, useContext, type ReactNode } from 'react'
import type { FileBrowserEngine } from './engine'

const FileBrowserContext = createContext<FileBrowserEngine | null>(null)

export function FileBrowserProvider({ engine, children }: { engine: FileBrowserEngine; children: ReactNode }) {
  return <FileBrowserContext.Provider value={engine}>{children}</FileBrowserContext.Provider>
}

/**
 * The engine for the nearest enclosing browser. Throws rather than returning null
 * so a component rendered outside the provider fails at the mistake instead of
 * further down on an undefined read.
 */
export function useFileBrowserContext(): FileBrowserEngine {
  const engine = useContext(FileBrowserContext)
  if (!engine) throw new Error('useFileBrowserContext must be used inside <FileBrowser>')
  return engine
}

/**
 * The engine if there is one, `null` otherwise. For components that work both
 * inside a browser and on their own — the preview panel is the main one, since an
 * app may render it on a standalone preview page.
 */
export function useOptionalFileBrowserContext(): FileBrowserEngine | null {
  return useContext(FileBrowserContext)
}
