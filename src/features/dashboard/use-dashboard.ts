import { useLiveQuery } from 'dexie-react-hooks'
import { database } from '@/db/database'

export function useDashboard() {
  const data = useLiveQuery(async () => {
    const [students, payments, slots, enrollments] = await Promise.all([
      database.students.toArray(),
      database.payments.toArray(),
      database.slots.toArray(),
      database.enrollments.toArray(),
    ])
    const period = new Date().toISOString().slice(0, 7)
    const activeStudents = students.filter((student) => student.active)
    const paidStudentIds = new Set(payments.filter((payment) => payment.period === period).map((payment) => payment.studentId))
    const monthlyRevenueCents = payments.filter((payment) => payment.period === period)
      .reduce((total, payment) => total + payment.amountCents, 0)
    const occupiedPlaces = enrollments.filter((enrollment) =>
      activeStudents.some((student) => student.id === enrollment.studentId),
    ).length
    const totalPlaces = slots.reduce((total, slot) => total + slot.capacity, 0)
    return {
      activeStudents: activeStudents.length,
      monthlyRevenueCents,
      pendingPayments: activeStudents.filter((student) => !paidStudentIds.has(student.id)).length,
      occupiedPlaces,
      totalPlaces,
      nextSlots: slots.slice(0, 3).map((slot) => ({
        ...slot,
        occupancy: enrollments.filter((enrollment) => enrollment.slotId === slot.id).length,
      })),
    }
  }, [])

  return { data, loading: data === undefined }
}
