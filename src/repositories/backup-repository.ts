import { database } from '@/db/database'
import type { AppBackup } from '@/domain/types'

export const backupRepository = {
  async export(): Promise<AppBackup> {
    const [students, slots, enrollments, payments] = await Promise.all([
      database.students.toArray(),
      database.slots.toArray(),
      database.enrollments.toArray(),
      database.payments.toArray(),
    ])
    return { version: 1, exportedAt: new Date().toISOString(), students, slots, enrollments, payments }
  },
  async restore(backup: AppBackup) {
    await database.transaction(
      'rw',
      [database.students, database.slots, database.enrollments, database.payments],
      async () => {
        await Promise.all([
          database.students.clear(),
          database.slots.clear(),
          database.enrollments.clear(),
          database.payments.clear(),
        ])
        await database.students.bulkAdd(backup.students)
        await database.slots.bulkAdd(backup.slots)
        await database.enrollments.bulkAdd(backup.enrollments)
        await database.payments.bulkAdd(backup.payments)
      },
    )
  },
  async clear() {
    await database.transaction(
      'rw',
      [database.students, database.slots, database.enrollments, database.payments],
      () => Promise.all([
        database.students.clear(),
        database.slots.clear(),
        database.enrollments.clear(),
        database.payments.clear(),
      ]),
    )
  },
}
