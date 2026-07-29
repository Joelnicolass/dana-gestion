import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { weekdays, type Weekday } from '@/domain/types'
import { scheduleRepository, type ScheduleSlotInput } from '@/repositories/schedule-repository'
import { studentRepository } from '@/repositories/student-repository'

export function useSchedule() {
  const [weekday, setWeekday] = useState<Weekday>(weekdays[0])
  const slots = useLiveQuery(() => scheduleRepository.listSlots(), [])
  const enrollments = useLiveQuery(() => scheduleRepository.listEnrollments(), [])
  const students = useLiveQuery(() => studentRepository.list(), [])

  const studentMap = useMemo(() => new Map((students ?? []).map((student) => [student.id, student])), [students])
  const displayedSlots = (slots ?? []).filter((slot) => slot.weekday === weekday).map((slot) => ({
    ...slot,
    attendees: (enrollments ?? [])
      .filter((enrollment) => enrollment.slotId === slot.id)
      .map((enrollment) => studentMap.get(enrollment.studentId))
      .filter((student) => student?.active),
  }))

  return {
    weekday,
    setWeekday,
    slots: displayedSlots,
    allSlots: slots ?? [],
    loading: slots === undefined,
    saveSlot: (input: ScheduleSlotInput, id?: string) =>
      scheduleRepository.saveSlot(input, id),
    deleteSlot: scheduleRepository.deleteSlot,
  }
}
