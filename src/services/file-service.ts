import type { AppBackup, Payment, Student } from '@/domain/types'

function download(content: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: unknown) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export function downloadBackup(backup: AppBackup) {
  download(JSON.stringify(backup, null, 2), `dana-backup-${backup.exportedAt.slice(0, 10)}.json`, 'application/json')
}

export function downloadStudentsCsv(students: Student[]) {
  const rows = students.map((student) => [
    student.firstName,
    student.lastName,
    student.phone,
    student.email,
    student.level,
    student.monthlyFeeCents,
    student.active,
  ])
  const csv = [['firstName', 'lastName', 'phone', 'email', 'level', 'monthlyFeeCents', 'active'], ...rows]
    .map((row) => row.map(csvCell).join(',')).join('\n')
  download(`\uFEFF${csv}`, 'students.csv', 'text/csv;charset=utf-8')
}

export function downloadPaymentsCsv(payments: Payment[], students: Student[]) {
  const names = new Map(students.map((student) => [student.id, `${student.firstName} ${student.lastName}`]))
  const rows = payments.map((payment) => [
    names.get(payment.studentId) ?? payment.studentId,
    payment.period,
    payment.amountCents,
    payment.paidAt,
  ])
  const csv = [['student', 'period', 'amountCents', 'paidAt'], ...rows]
    .map((row) => row.map(csvCell).join(',')).join('\n')
  download(`\uFEFF${csv}`, 'payments.csv', 'text/csv;charset=utf-8')
}
