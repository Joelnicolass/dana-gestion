import { database } from '@/db/database'
import type { Payment } from '@/domain/types'

export const paymentRepository = {
  list: () => database.payments.toArray(),
  byPeriod: (period: string) => database.payments.where('period').equals(period).toArray(),
  async markPaid(studentId: string, period: string, amountCents: number) {
    const existing = await database.payments.where('[studentId+period]').equals([studentId, period]).first()
    if (existing) {
      await database.payments.update(existing.id, { amountCents, paidAt: new Date().toISOString() })
      return
    }
    await database.payments.add({
      id: crypto.randomUUID(),
      studentId,
      period,
      amountCents,
      paidAt: new Date().toISOString(),
    })
  },
  async markUnpaid(studentId: string, period: string) {
    await database.payments.where('[studentId+period]').equals([studentId, period]).delete()
  },
  bulkPut: (payments: Payment[]) => database.payments.bulkPut(payments),
}
