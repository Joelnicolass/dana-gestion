import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { paymentRepository } from '@/repositories/payment-repository'
import { studentRepository } from '@/repositories/student-repository'

export function usePayments() {
  const now = new Date()
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'))
  const [year, setYear] = useState(String(now.getFullYear()))
  const period = `${year}-${month}`
  const students = useLiveQuery(() => studentRepository.list(), [])
  const payments = useLiveQuery(() => paymentRepository.byPeriod(period), [period])

  const rows = useMemo(() => {
    const paymentMap = new Map((payments ?? []).map((payment) => [payment.studentId, payment]))
    return (students ?? []).filter((student) => student.active).map((student) => ({
      student,
      payment: paymentMap.get(student.id),
    }))
  }, [payments, students])

  const collectedCents = rows.reduce((total, row) => total + (row.payment?.amountCents ?? 0), 0)
  const expectedCents = rows.reduce((total, row) => total + row.student.monthlyFeeCents, 0)

  async function toggle(studentId: string, amountCents: number, paid: boolean) {
    if (paid) await paymentRepository.markUnpaid(studentId, period)
    else await paymentRepository.markPaid(studentId, period, amountCents)
  }

  return { month, setMonth, year, setYear, period, rows, collectedCents, expectedCents, toggle, loading: !students || !payments }
}
