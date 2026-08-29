import { describe, expect, it } from 'vitest'
import { getBaseName, getExtension, joinPath, sanitizeFileName, splitFileName, truncateMiddle, uniqueName, validateName } from './names'

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

describe('splitFileName', () => {
  const split = (name: string) => {
    const { stem, extension } = splitFileName(name)
    return `${stem} | ${extension}`
  }

  it('splits an ordinary filename', () => {
    expect(split('photo.jpg')).toBe('photo | jpg')
    expect(split('Cost Breakdown.xlsx')).toBe('Cost Breakdown | xlsx')
  })

  it('keeps compound archive extensions together', () => {
    expect(split('archive.tar.gz')).toBe('archive | tar.gz')
    expect(split('backup.sql.gz')).toBe('backup | sql.gz')
    expect(split('site.tar.bz2')).toBe('site | tar.bz2')
    expect(split('dump.tar.zst')).toBe('dump | tar.zst')
  })

  it('keeps known two-part extensions together', () => {
    expect(split('index.d.ts')).toBe('index | d.ts')
  })

  it('does not invent compounds out of naming conventions', () => {
    // `jquery.min` is the name of the file; the extension is `js`.
    expect(split('jquery.min.js')).toBe('jquery.min | js')
    expect(split('button.test.tsx')).toBe('button.test | tsx')
  })

  it('leaves dots inside a name alone', () => {
    expect(split('Report v1.2 Final.pdf')).toBe('Report v1.2 Final | pdf')
    expect(split('data.2024.csv')).toBe('data.2024 | csv')
    expect(split('My.Company.Report.docx')).toBe('My.Company.Report | docx')
  })

  it('treats a leading dot as a hidden file, not an extension', () => {
    expect(split('.gitignore')).toBe('.gitignore | ')
    expect(split('.env')).toBe('.env | ')
  })

  it('returns the whole name when there is no usable extension', () => {
    expect(split('README')).toBe('README | ')
    expect(split('notes.')).toBe('notes. | ')
    // Too long and too wordy to be an extension.
    expect(split('minutes.from the meeting')).toBe('minutes.from the meeting | ')
  })

  it('preserves case, leaving presentation to the caller', () => {
    expect(split('IMG_0421.HEIC')).toBe('IMG_0421 | HEIC')
    expect(split('Archive.TAR.GZ')).toBe('Archive | TAR.GZ')
  })

  it('ignores a directory trailing slash', () => {
    expect(split('folder.v2/')).toBe('folder | v2')
  })
})
