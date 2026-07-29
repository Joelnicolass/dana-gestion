import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { formatMoney } from '@/lib/formatters'

export function PaymentSummary({ collectedCents, expectedCents }: { collectedCents: number; expectedCents: number }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="py-4"><CardContent className="px-4"><p className="text-sm text-muted-foreground">{t('payments.collected')}</p><p className="text-xl font-bold text-primary">{formatMoney(collectedCents)}</p></CardContent></Card>
      <Card className="py-4"><CardContent className="px-4"><p className="text-sm text-muted-foreground">{t('payments.expected')}</p><p className="text-xl font-bold">{formatMoney(expectedCents)}</p></CardContent></Card>
    </div>
  )
}
