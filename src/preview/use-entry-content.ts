import { useEffect, useState } from 'react'
import type { FileSystemAdapter } from '../adapter/types'
import type { FileEntry } from '../core/types'
import { BINARY_STRATEGIES, TEXT_STRATEGIES, type PreviewStrategy } from './registry'

/**
 * Reads a buffer as one code unit per byte.
 *
 * Not `TextDecoder('iso-8859-1')`: the Encoding Standard aliases that to
 * windows-1252, which remaps 0x80–0x9F and so no longer round-trips a byte. A .eml
 * declares a charset per MIME part and the parser decodes each one itself, so it
 * needs the original bytes intact.
 */
function decodeAsLatin1(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let out = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    out += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return out
}

export interface EntryContent {
  text: string | null
  binary: ArrayBuffer | null
  loading: boolean
  error: string | null
}

/**
 * Fetches whatever the chosen viewer needs, or nothing when the strategy renders
 * straight from a URL. Re-fetches on entry change and discards a response whose
 * request has been superseded.
 */
export function useEntryContent(entry: FileEntry | null, strategy: PreviewStrategy, adapter: FileSystemAdapter): EntryContent {
  const [content, setContent] = useState<EntryContent>({ text: null, binary: null, loading: false, error: null })

  useEffect(() => {
    const needsText = TEXT_STRATEGIES.has(strategy)
    const needsBinary = BINARY_STRATEGIES.has(strategy)
    if (!entry || (!needsText && !needsBinary) || !adapter.read) {
      setContent({ text: null, binary: null, loading: false, error: null })
      return
    }

    let cancelled = false
    setContent({ text: null, binary: null, loading: true, error: null })

    adapter
      .read(entry)
      .then((buffer) => {
        if (cancelled) return
        // EML is fetched as bytes and decoded latin-1 so per-part charsets survive;
        // CSV and HTML carry no such declaration and read as UTF-8.
        if (strategy === 'eml') setContent({ text: decodeAsLatin1(buffer), binary: null, loading: false, error: null })
        else if (needsText) setContent({ text: new TextDecoder().decode(buffer), binary: null, loading: false, error: null })
        else setContent({ text: null, binary: buffer, loading: false, error: null })
      })
      .catch((e) => {
        if (cancelled) return
        console.error('Failed to load file content', e)
        setContent({ text: null, binary: null, loading: false, error: 'Failed to load file content' })
      })

    return () => {
      cancelled = true
    }
  }, [entry, strategy, adapter])

  return content
}
