import Dexie, { type EntityTable } from 'dexie'
import type { Enrollment, Payment, ScheduleSlot, Student } from '@/domain/types'

export class DanaDatabase extends Dexie {
  students!: EntityTable<Student, 'id'>
  slots!: EntityTable<ScheduleSlot, 'id'>
  enrollments!: EntityTable<Enrollment, 'id'>
  payments!: EntityTable<Payment, 'id'>

  constructor() {
    super('dana-management')
    this.version(1).stores({
      students: 'id, active, lastName, firstName, level',
      slots: 'id, weekday, [weekday+startTime], level',
      enrollments: 'id, studentId, slotId, [studentId+slotId]',
      payments: 'id, studentId, period, [studentId+period]',
    })
  }
}

export const database = new DanaDatabase()
