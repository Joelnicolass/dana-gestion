import { Check, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Payment, Student } from '@/domain/types'
import { formatMoney, formatStudentName } from '@/lib/formatters'

export interface PaymentRow {
  student: Student
  payment: Payment | undefined
}

interface PaymentListProps {
  rows: PaymentRow[]
  loading: boolean
  onTogglePayment: (studentId: string, amountCents: number, paid: boolean) => void
}

export function PaymentList({ rows, loading, onTogglePayment }: PaymentListProps) {
  const { t } = useTranslation()
  if (loading) return <p className="py-12 text-center text-muted-foreground">{t('common.loading')}</p>
  if (!rows.length) return <p className="py-12 text-center text-muted-foreground">{t('payments.empty')}</p>
  return (
    <div className="space-y-3">
      {rows.map(({ student, payment }) => (
        <Card key={student.id} className="py-3"><CardContent className="flex items-center gap-3 px-4">
          <div className={`grid size-10 place-items-center rounded-full ${payment ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{payment ? <Check /> : <Clock />}</div>
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{formatStudentName(student.firstName, student.lastName)}</p><p className="text-sm text-muted-foreground">{formatMoney(student.monthlyFeeCents)}</p></div>
          <Button variant={payment ? 'secondary' : 'default'} className="min-h-11" onClick={() => onTogglePayment(student.id, student.monthlyFeeCents, Boolean(payment))}>{t(payment ? 'payments.paid' : 'payments.pending')}</Button>
        </CardContent></Card>
      ))}
    </div>
  )
}
