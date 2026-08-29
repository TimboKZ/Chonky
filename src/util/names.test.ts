import { describe, expect, it } from 'vitest'
import { getBaseName, getExtension, joinPath, sanitizeFileName, truncateMiddle, uniqueName, validateName } from './names'

describe('getExtension', () => {
  it('returns the extension lowercased, without the dot', () => {
    expect(getExtension('Report.PDF')).toBe('pdf')
    expect(getExtension('archive.tar.gz')).toBe('gz')
  })

  it('returns empty for names without a usable extension', () => {
    expect(getExtension('README')).toBe('')
    // A leading dot makes a hidden file, not an extension.
    expect(getExtension('.gitignore')).toBe('')
    // A trailing dot leaves nothing after it.
    expect(getExtension('name.')).toBe('')
  })

  it('ignores a directory trailing slash', () => {
    expect(getExtension('folder.v2/')).toBe('v2')
  })
})

describe('getBaseName', () => {
  it('strips the extension and keeps a hidden file whole', () => {
    expect(getBaseName('Report Q1.pdf')).toBe('Report Q1')
    expect(getBaseName('.gitignore')).toBe('.gitignore')
    expect(getBaseName('archive.tar.gz')).toBe('archive.tar')
  })
})

describe('uniqueName', () => {
  it('returns the name untouched when nothing has claimed it', () => {
    expect(uniqueName('a.txt', ['b.txt'])).toBe('a.txt')
  })

  it('inserts the counter before the extension', () => {
    expect(uniqueName('a.txt', ['a.txt'])).toBe('a (2).txt')
    expect(uniqueName('a.txt', ['a.txt', 'a (2).txt'])).toBe('a (3).txt')
  })

  it('counts up from an existing suffix rather than nesting them', () => {
    expect(uniqueName('a (2).txt', ['a (2).txt'])).toBe('a (3).txt')
  })

  it('handles extensionless names', () => {
    expect(uniqueName('Report', ['Report'])).toBe('Report (2)')
  })
})

describe('sanitizeFileName', () => {
  it('strips characters the backend rejects and collapses whitespace', () => {
    expect(sanitizeFileName('in:valid/name?.txt')).toBe('invalidname.txt')
    expect(sanitizeFileName('a   b.txt')).toBe('a b.txt')
  })

  it('keeps the extension when the stem sanitizes away entirely', () => {
    expect(sanitizeFileName('***.pdf')).toBe('file.pdf')
  })

  it('falls back to a usable name when there is no extension either', () => {
    expect(sanitizeFileName('***')).toBe('file')
  })
})

describe('validateName', () => {
  it('rejects empty, illegal, and dot-edged names', () => {
    expect(validateName('  ').valid).toBe(false)
    expect(validateName('a/b').valid).toBe(false)
    expect(validateName('.hidden').valid).toBe(false)
    expect(validateName('trailing.').valid).toBe(false)
  })

  it('accepts an ordinary filename', () => {
    expect(validateName('Report Q1 (final).pdf').valid).toBe(true)
  })
})

describe('truncateMiddle', () => {
  it('keeps short names whole', () => {
    expect(truncateMiddle('short.txt', 30)).toBe('short.txt')
  })

  it('preserves both ends, so the extension stays readable', () => {
    const result = truncateMiddle('a-really-very-extremely-long-file-name.pdf', 30)
    expect(result).toContain('...')
    expect(result.startsWith('a-really')).toBe(true)
    expect(result.endsWith('.pdf')).toBe(true)
  })
})

describe('joinPath', () => {
  it('joins segments and collapses duplicate slashes', () => {
    expect(joinPath('a', 'b', 'c')).toBe('a/b/c')
    expect(joinPath('a/', '/b')).toBe('a/b')
  })

  it('skips empty and nullish segments', () => {
    expect(joinPath('', 'b', undefined, null, 'c')).toBe('b/c')
  })
})
