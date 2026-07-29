import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePayments } from './use-payments'

export function usePaymentsController() {
  const { t } = useTranslation()
  const payments = usePayments()
  const currentYear = new Date().getFullYear()

  async function togglePayment(studentId: string, amountCents: number, paid: boolean) {
    await payments.toggle(studentId, amountCents, paid)
    toast.success(t(paid ? 'payments.markedUnpaid' : 'payments.markedPaid'))
  }

  return {
    ...payments,
    monthOptions: Array.from({ length: 12 }, (_, index) => {
      const value = String(index + 1).padStart(2, '0')
      return { value, label: t(`months.${value}`) }
    }),
    yearOptions: [currentYear - 1, currentYear, currentYear + 1].map(String).map((value) => ({ value, label: value })),
    onTogglePayment: togglePayment,
  }
}
