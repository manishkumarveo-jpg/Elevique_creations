export type CsvColumn<T> = {
  label: string
  value: (row: T) => string | number | boolean | null | undefined
}

const BOM = String.fromCharCode(0xfeff)

function escapeCsvField(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map(c => escapeCsvField(c.label)).join(',')
  const lines = rows.map(row => columns.map(c => escapeCsvField(c.value(row))).join(','))
  return [header, ...lines].join('\r\n')
}

export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
