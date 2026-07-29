import { useTranslation } from 'react-i18next'
import type { SelectOption } from '@/components/form-select'
import type { PaymentRow } from './payment-list'
import { PaymentFilters } from './payment-filters'
import { PaymentList } from './payment-list'
import { PaymentSummary } from './payment-summary'

interface PaymentsViewProps {
  month: string
  year: string
  monthOptions: SelectOption[]
  yearOptions: SelectOption[]
  rows: PaymentRow[]
  collectedCents: number
  expectedCents: number
  loading: boolean
  setMonth: (value: string) => void
  setYear: (value: string) => void
  onTogglePayment: (studentId: string, amountCents: number, paid: boolean) => void
}

export function PaymentsView(props: PaymentsViewProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('payments.title')}</h1>
      <PaymentFilters month={props.month} year={props.year} monthOptions={props.monthOptions} yearOptions={props.yearOptions} onMonthChange={props.setMonth} onYearChange={props.setYear} />
      <PaymentSummary collectedCents={props.collectedCents} expectedCents={props.expectedCents} />
      <PaymentList rows={props.rows} loading={props.loading} onTogglePayment={props.onTogglePayment} />
    </div>
  )
}
