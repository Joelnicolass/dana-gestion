import { useTranslation } from 'react-i18next'
import { FormSelect, type SelectOption } from '@/components/form-select'
import { Label } from '@/components/ui/label'

interface PaymentFiltersProps {
  month: string
  year: string
  monthOptions: SelectOption[]
  yearOptions: SelectOption[]
  onMonthChange: (value: string) => void
  onYearChange: (value: string) => void
}

export function PaymentFilters(props: PaymentFiltersProps) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1"><Label>{t('common.month')}</Label><FormSelect ariaLabel={t('common.month')} value={props.month} options={props.monthOptions} onValueChange={props.onMonthChange} /></div>
      <div className="space-y-1"><Label>{t('common.year')}</Label><FormSelect ariaLabel={t('common.year')} value={props.year} options={props.yearOptions} onValueChange={props.onYearChange} /></div>
    </div>
  )
}
