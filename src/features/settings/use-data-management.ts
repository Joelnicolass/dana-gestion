import type { StudentInput } from '@/domain/types'
import { backupRepository } from '@/repositories/backup-repository'
import { paymentRepository } from '@/repositories/payment-repository'
import { scheduleRepository } from '@/repositories/schedule-repository'
import { studentRepository } from '@/repositories/student-repository'
import { downloadBackup, downloadPaymentsCsv, downloadStudentsCsv } from '@/services/file-service'
import { parseBackup } from '@/services/backup-parser'
import { importSpreadsheet } from '@/services/spreadsheet-import-adapter'

const demoStudents: StudentInput[] = [
  { firstName: 'Alex', lastName: 'Rivera', phone: '11 5555 0101', email: 'alex@example.com', notes: '', level: 'beginner', monthlyFeeCents: 2800000, active: true },
  { firstName: 'Sam', lastName: 'Moreno', phone: '11 5555 0102', email: 'sam@example.com', notes: '', level: 'intermediate', monthlyFeeCents: 3000000, active: true },
  { firstName: 'Taylor', lastName: 'Castro', phone: '11 5555 0103', email: 'taylor@example.com', notes: '', level: 'advanced', monthlyFeeCents: 3200000, active: true },
]

export function useDataManagement() {
  async function exportBackup() {
    downloadBackup(await backupRepository.export())
  }

  async function importFile(file: File, paymentYear: number) {
    if (file.name.toLowerCase().endsWith('.json')) {
      await backupRepository.restore(parseBackup(await file.text()))
      return
    }
    await importSpreadsheet(file, paymentYear)
  }

  async function exportStudents() {
    downloadStudentsCsv(await studentRepository.list())
  }

  async function exportPayments() {
    downloadPaymentsCsv(await paymentRepository.list(), await studentRepository.list())
  }

  async function seedDemo() {
    await scheduleRepository.seedSlots()
    const slots = await scheduleRepository.listSlots()
    for (const [index, input] of demoStudents.entries()) {
      const student = await studentRepository.create(input)
      await scheduleRepository.replaceStudentEnrollments(student.id, slots.slice(index * 2, index * 2 + 2).map((slot) => slot.id))
      if (index < 2) await paymentRepository.markPaid(student.id, new Date().toISOString().slice(0, 7), student.monthlyFeeCents)
    }
  }

  return { exportBackup, importFile, exportStudents, exportPayments, seedDemo, clear: backupRepository.clear }
}
