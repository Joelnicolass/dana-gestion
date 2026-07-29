import { database } from '@/db/database'
import { levels, weekdays, type Enrollment, type ScheduleSlot, type Weekday } from '@/domain/types'

const startTimes = ['09:00', '10:30', '16:00', '17:30', '19:00']

export type ScheduleSlotInput = Omit<ScheduleSlot, 'id'>

function endTime(startTime: string) {
  const [hours, minutes] = startTime.split(':').map(Number)
  const date = new Date(0)
  date.setUTCHours(hours, minutes + 60)
  return date.toISOString().slice(11, 16)
}

export const scheduleRepository = {
  async listSlots() {
    const slots = await database.slots.toArray()
    return slots.sort((left, right) =>
      weekdays.indexOf(left.weekday) - weekdays.indexOf(right.weekday) || left.startTime.localeCompare(right.startTime),
    )
  },
  listEnrollments: () => database.enrollments.toArray(),
  async seedSlots() {
    await database.transaction('rw', database.slots, async () => {
      if (await database.slots.count()) return
      const slots = weekdays.flatMap((weekday, dayIndex) =>
        startTimes.map((startTime, timeIndex): ScheduleSlot => ({
          id: `${weekday}-${startTime}`,
          weekday,
          startTime,
          endTime: endTime(startTime),
          level: levels[(dayIndex + timeIndex) % levels.length],
          capacity: 5,
        })),
      )
      await database.slots.bulkAdd(slots)
    })
  },
  async saveSlot(input: ScheduleSlotInput, id?: string) {
    const duplicate = await database.slots
      .where('[weekday+startTime]')
      .equals([input.weekday, input.startTime])
      .first()
    if (duplicate && duplicate.id !== id) throw new Error('DUPLICATE_SLOT')

    const slot: ScheduleSlot = { ...input, id: id ?? crypto.randomUUID() }
    await database.slots.put(slot)
    return slot
  },
  async deleteSlot(id: string) {
    await database.transaction('rw', database.slots, database.enrollments, async () => {
      await database.enrollments.where('slotId').equals(id).delete()
      await database.slots.delete(id)
    })
  },
  async replaceStudentEnrollments(studentId: string, slotIds: string[]) {
    await database.transaction('rw', database.enrollments, async () => {
      await database.enrollments.where('studentId').equals(studentId).delete()
      await database.enrollments.bulkAdd(
        slotIds.map((slotId): Enrollment => ({
          id: crypto.randomUUID(),
          studentId,
          slotId,
          createdAt: new Date().toISOString(),
        })),
      )
    })
  },
  bulkPutSlots: (slots: ScheduleSlot[]) => database.slots.bulkPut(slots),
  bulkPutEnrollments: (enrollments: Enrollment[]) => database.enrollments.bulkPut(enrollments),
  byDay: (weekday: Weekday) => database.slots.where('weekday').equals(weekday).sortBy('startTime'),
}
