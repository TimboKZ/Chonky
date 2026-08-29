import { describe, test, expect } from 'vitest'
import { convertHeicFileToJpeg, convertHeicBytesToJpeg } from './heic'

// These run in headless Chromium via `pnpm test:browser`.
// Fixtures live in public/fixtures/ and are served at /fixtures/ by the Vite dev server.
describe('heic-converter — all HEIC/HEIF variants', () => {
  async function fetchFixture(name: string, mimeType = 'image/heic'): Promise<File> {
    const resp = await fetch(`/fixtures/${name}`)
    if (!resp.ok) throw new Error(`Fixture not found: ${name} (${resp.status})`)
    const bytes = new Uint8Array(await resp.arrayBuffer())
    return new File([bytes], name, { type: mimeType })
  }

  const VARIANTS = [
    { name: 'standard HEIC (heic+mif1)', fixture: 'test-image1.heic' },
    { name: 'MiHB+MiPr (iOS 18 / FSG-23843 original bug)', fixture: 'test-heic-mihb.heic' },
    { name: 'MiHB+MiHE+MiPr (iPhone 15 Pro HDR)', fixture: 'test-heic-hdr.heic' },
    { name: 'MiHB (iPhone X)', fixture: 'test-heic-iphone-x.heic' },
    { name: 'MiHB+MiPr (iPhone 12 mini)', fixture: 'test-heic-iphone-12mini.heic' },
    { name: 'HEIC with alpha channel (miaf)', fixture: 'test-heic-with-alpha.heic' },
    // tmap = Apple HDR Gain Map (addl_back_room_a.heic — the file that triggered FSG-23843 regression)
    { name: 'tmap (Apple HDR Gain Map / addl_back_room_a.heic)', fixture: 'test-heic-tmap.heic' },
  ]

  for (const v of VARIANTS) {
    test(v.name, async () => {
      const file = await fetchFixture(v.fixture)
      const result = await convertHeicFileToJpeg(file)
      expect(result.type).toBe('image/jpeg')
      expect(result.name.endsWith('.jpg')).toBe(true)
      expect(result.size).toBeGreaterThan(0)
    })
  }

  test('convertHeicBytesToJpeg — bytes-in bytes-out (used by Convert to JPG action)', async () => {
    const resp = await fetch('/fixtures/test-image1.heic')
    const bytes = new Uint8Array(await resp.arrayBuffer())
    const result = await convertHeicBytesToJpeg(bytes)
    expect(result.byteLength).toBeGreaterThan(0)
    // JPEG magic: FF D8 FF
    expect(result[0]).toBe(0xff)
    expect(result[1]).toBe(0xd8)
    expect(result[2]).toBe(0xff)
  })

  test('convertHeicFileToJpeg — non-HEIC file passes through untouched', async () => {
    const txt = new File(['hello'], 'note.txt', { type: 'text/plain' })
    const result = await convertHeicFileToJpeg(txt)
    expect(result).toBe(txt) // same reference — no conversion
  })
})
