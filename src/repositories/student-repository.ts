import { database } from '@/db/database'
import type { Student, StudentInput } from '@/domain/types'

export const studentRepository = {
  list: () => database.students.orderBy('lastName').toArray(),
  get: (id: string) => database.students.get(id),
  async create(input: StudentInput) {
    const now = new Date().toISOString()
    const student: Student = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
    await database.students.add(student)
    return student
  },
  async update(id: string, input: StudentInput) {
    await database.students.update(id, { ...input, updatedAt: new Date().toISOString() })
  },
  async setActive(id: string, active: boolean) {
    await database.students.update(id, { active, updatedAt: new Date().toISOString() })
  },
  bulkPut: (students: Student[]) => database.students.bulkPut(students),
}
