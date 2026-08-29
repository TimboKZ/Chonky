import { useMemo } from 'react'

/**
 * Simple CSV parser that handles quoted fields and commas within quotes.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"'
        i++ // skip next quote
      } else if (char === '"') {
        inQuotes = false
      } else {
        currentField += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        currentRow.push(currentField)
        currentField = ''
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField)
        currentField = ''
        rows.push(currentRow)
        currentRow = []
        if (char === '\r') i++ // skip \n after \r
      } else {
        currentField += char
      }
    }
  }

  // Push last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  return rows
}

export interface CsvViewerProps {
  /** Raw CSV string content to render */
  content: string
  /** Maximum number of rows to display (default: 50) */
  maxRows?: number
  /** Additional CSS class */
  className?: string
}

export function CsvViewer({ content, maxRows = 50, className = '' }: CsvViewerProps) {
  const data = useMemo(() => {
    let parsed = parseCsv(content)
    if (parsed.length > maxRows) {
      parsed = parsed.slice(0, maxRows)
      const rowLength = parsed[0]?.length || 0
      parsed.push(Array.from({ length: rowLength }, () => '...'))
    }
    return parsed
  }, [content, maxRows])

  return (
    <div className={`overflow-x-scroll overflow-y-auto h-full flex flex-col whitespace-nowrap text-[10px] ${className}`}>
      {data.length > 0 && (
        <table className="border border-collapse border-gray-200" style={{ zoom: 0.8 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              {data[0]?.map((header: string, i: number) => (
                <th key={i} className="border border-gray-200 p-[2px] bg-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row: string[], rowIdx: number) => (
              <tr key={rowIdx}>
                {row.map((cell: string, cellIdx: number) => (
                  <td key={cellIdx} className="border border-gray-200 p-[2px]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
