import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { Student, StudentInput } from '@/domain/types'
import { emptyStudentInput } from './use-students'

function inputFrom(student: Student | null): StudentInput {
  if (!student) return emptyStudentInput
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    phone: student.phone,
    email: student.email,
    notes: student.notes,
    level: student.level,
    monthlyFeeCents: student.monthlyFeeCents,
    active: student.active,
  }
}

export function useStudentForm(
  saveStudent: (input: StudentInput, id: string | null, slotIds: string[]) => Promise<void>,
  onSaved: () => void,
) {
  const { t } = useTranslation()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [input, setInput] = useState<StudentInput>(emptyStudentInput)
  const [slotIds, setSlotIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function initialize(student: Student | null, selectedSlotIds: string[]) {
    setStudentId(student?.id ?? null)
    setInput(inputFrom(student))
    setSlotIds(selectedSlotIds)
  }

  function updateField<Key extends keyof StudentInput>(field: Key, value: StudentInput[Key]) {
    setInput((current) => ({ ...current, [field]: value }))
  }

  function updateFee(value: string) {
    updateField('monthlyFeeCents', Math.round(Number(value) * 100))
  }

  function toggleSlot(slotId: string, checked: boolean) {
    setSlotIds((current) => checked ? [...current, slotId] : current.filter((id) => id !== slotId))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!input.firstName.trim() || !input.lastName.trim()) {
      toast.error(t('validation.required'))
      return
    }
    setSaving(true)
    try {
      await saveStudent(input, studentId, slotIds)
      toast.success(t('students.saved'))
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return { input, slotIds, saving, initialize, updateField, updateFee, toggleSlot, submit }
}
