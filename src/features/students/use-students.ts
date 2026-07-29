import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import type { Student, StudentInput } from '@/domain/types'
import { scheduleRepository } from '@/repositories/schedule-repository'
import { studentRepository } from '@/repositories/student-repository'

export const emptyStudentInput: StudentInput = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  notes: '',
  level: 'beginner',
  monthlyFeeCents: 0,
  active: true,
}

export function useStudents() {
  const students = useLiveQuery(() => studentRepository.list())
  const enrollments = useLiveQuery(() => scheduleRepository.listEnrollments(), [])
  const [search, setSearch] = useState('')

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return (students ?? []).filter((student) =>
      `${student.firstName} ${student.lastName} ${student.phone} ${student.email}`.toLocaleLowerCase().includes(query),
    )
  }, [search, students])

  async function save(input: StudentInput, id: string | null, slotIds: string[]) {
    if (id) {
      await studentRepository.update(id, input)
      await scheduleRepository.replaceStudentEnrollments(id, slotIds)
      return
    }
    const student = await studentRepository.create(input)
    await scheduleRepository.replaceStudentEnrollments(student.id, slotIds)
  }

  return {
    students: filteredStudents,
    allStudents: students ?? [],
    loading: students === undefined,
    search,
    setSearch,
    save,
    setActive: studentRepository.setActive,
    enrollmentIds: (student: Student) =>
      (enrollments ?? []).filter((enrollment) => enrollment.studentId === student.id).map((enrollment) => enrollment.slotId),
  }
}
