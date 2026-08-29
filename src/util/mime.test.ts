import { describe, expect, it } from 'vitest'
import { getFileKind, getKindLabel, isHeic } from './mime'

describe('getFileKind', () => {
  it('classifies a directory before looking at anything else', () => {
    expect(getFileKind({ name: 'photos.zip', isDir: true })).toBe('folder')
  })

  it('prefers the extension over the MIME type', () => {
    // The file-storage service reports octet-stream for anything it cannot sniff,
    // which would otherwise flatten most office formats to `unknown`.
    expect(getFileKind({ name: 'budget.xlsx', mimeType: 'application/octet-stream' })).toBe('spreadsheet')
    expect(getFileKind({ name: 'model.stl', mimeType: 'application/octet-stream' })).toBe('model')
  })

  it('falls back to the MIME type when the name carries no extension', () => {
    expect(getFileKind({ name: 'scan', mimeType: 'application/pdf' })).toBe('pdf')
    expect(getFileKind({ name: 'clip', mimeType: 'video/mp4' })).toBe('video')
  })

  it('returns unknown when neither signal helps', () => {
    expect(getFileKind({ name: 'data', mimeType: 'application/octet-stream' })).toBe('unknown')
  })
})

describe('getKindLabel', () => {
  it('gives a human label for the details view', () => {
    expect(getKindLabel(getFileKind({ name: 'a.pdf' }))).toBe('PDF')
    expect(getKindLabel(getFileKind({ name: 'a.stl' }))).toBe('3D model')
  })
})

describe('isHeic', () => {
  it('matches by MIME type and by extension, case-insensitively', () => {
    expect(isHeic({ mimeType: 'image/heic' })).toBe(true)
    expect(isHeic({ name: 'IMG_1234.HEIF' })).toBe(true)
    expect(isHeic({ name: 'photo.jpg', mimeType: 'image/jpeg' })).toBe(false)
  })
})
