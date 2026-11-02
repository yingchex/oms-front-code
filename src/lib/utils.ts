import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadCsv(filename: string, rows: Record<string, string | number | null | undefined>[]) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0]!)
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(String(row[h] ?? ''))).join(',')),
  ]
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
