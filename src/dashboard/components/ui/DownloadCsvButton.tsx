'use client'

import { Download } from 'lucide-react'
import { Button } from './Button'
import { toCSV, downloadCSV, type CsvColumn } from '@/dashboard/lib/utils/csv'

interface DownloadCsvButtonProps<T> {
  data: T[]
  columns: CsvColumn<T>[]
  filename: string
  label?: string
}

export function DownloadCsvButton<T>({ data, columns, filename, label = 'Download CSV' }: DownloadCsvButtonProps<T>) {
  function handleDownload() {
    downloadCSV(filename, toCSV(data, columns))
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={data.length === 0}
      onClick={handleDownload}
      title={data.length === 0 ? 'No records to export' : `Download ${data.length} record${data.length === 1 ? '' : 's'} as CSV`}
    >
      <Download size={13} /> {label}
    </Button>
  )
}
