import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { Student } from '@/domain/types'
import { useSchedule } from '@/features/schedule/use-schedule'
import { useStudentForm } from './use-student-form'
import { useStudents } from './use-students'

export function useStudentsController() {
  const { t } = useTranslation()
  const studentsData = useStudents()
  const { allSlots } = useSchedule()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  function closeDialog() {
    setDialogOpen(false)
    setEditingStudent(null)
  }

  const form = useStudentForm(studentsData.save, closeDialog)

  function createStudent() {
    setEditingStudent(null)
    form.initialize(null, [])
    setDialogOpen(true)
  }

  function editStudent(student: Student) {
    setEditingStudent(student)
    form.initialize(student, studentsData.enrollmentIds(student))
    setDialogOpen(true)
  }

  async function toggleActive(student: Student) {
    await studentsData.setActive(student.id, !student.active)
    toast.success(t('students.statusUpdated'))
  }

  return {
    students: studentsData.students,
    loading: studentsData.loading,
    search: studentsData.search,
    onSearchChange: studentsData.setSearch,
    slots: allSlots,
    dialogOpen,
    editingStudent,
    form,
    onCreate: createStudent,
    onEdit: editStudent,
    onToggleActive: toggleActive,
    onDialogOpenChange: (open: boolean) => open ? setDialogOpen(true) : closeDialog(),
    onCloseDialog: closeDialog,
  }
}
