import { useMemo, useState } from 'react'
import { read, utils } from 'xlsx'

interface SheetData {
  name: string
  rows: unknown[][]
}

export interface XlsxViewerProps {
  /** Raw XLSX/XLS file content as an ArrayBuffer */
  content: ArrayBuffer
  /** Maximum number of rows to display per sheet (default: 100) */
  maxRows?: number
  /** Additional CSS class */
  className?: string
}

export function XlsxViewer({ content, maxRows = 100, className = '' }: XlsxViewerProps) {
  const [activeSheet, setActiveSheet] = useState(0)

  const sheets = useMemo(() => {
    try {
      const workbook = read(content, { type: 'array' })

      return workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name]
        let rows: unknown[][] = utils.sheet_to_json(sheet, { header: 1 })

        if (rows.length > maxRows + 1) {
          const colCount = Math.max(...rows.slice(0, maxRows + 1).map((r) => (r as unknown[]).length), 1)
          rows = rows.slice(0, maxRows + 1)
          rows.push(Array.from({ length: colCount }, () => '...'))
        }

        return { name, rows } as SheetData
      })
    } catch (e) {
      console.error('XlsxViewer parse error:', e)
      return []
    }
  }, [content, maxRows])

  if (sheets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data found in this spreadsheet.</p>
      </div>
    )
  }

  const currentSheet = sheets[activeSheet]

  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      {sheets.length > 1 && (
        <div className="inline-flex items-center p-[3px] bg-muted rounded-[10px] shrink-0 overflow-x-auto mb-xs">
          {sheets.map((sheet, index) => (
            <button
              key={sheet.name}
              className={`flex items-center justify-center px-[16px] py-[4px] h-[28px] text-sm font-semibold rounded-[8px] whitespace-nowrap transition-all ${
                index === activeSheet
                  ? 'bg-background text-foreground shadow-[0px_0px_7px_-3px_rgba(17,24,39,0.16),0px_3px_5px_-4px_rgba(17,24,39,0.06)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveSheet(index)}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {currentSheet && currentSheet.rows.length > 0 ? (
          <table className="border border-collapse border-gray-200 whitespace-nowrap text-[10px]" style={{ zoom: 0.8 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                {(currentSheet.rows[0] as unknown[]).map((header, i) => (
                  <th key={i} className="border border-gray-200 p-[2px] bg-gray-200">
                    {header != null ? String(header) : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheet.rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {(row as unknown[]).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-200 p-[2px]">
                      {cell != null ? String(cell) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 p-md">This sheet is empty.</p>
        )}
      </div>
    </div>
  )
}
