import { CircleDollarSign, Clock3, GraduationCap, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatMoney } from '@/lib/formatters'

interface MetricGridProps {
  activeStudents: number
  monthlyRevenueCents: number
  pendingPayments: number
  occupiedPlaces: number
  totalPlaces: number
}

export function MetricGrid(props: MetricGridProps) {
  const { t } = useTranslation()
  const metrics = [
    { key: 'activeStudents', value: props.activeStudents, icon: Users },
    { key: 'monthlyRevenue', value: formatMoney(props.monthlyRevenueCents), icon: CircleDollarSign },
    { key: 'pendingPayments', value: props.pendingPayments, icon: Clock3 },
    { key: 'occupiedPlaces', value: `${props.occupiedPlaces}/${props.totalPlaces}`, icon: GraduationCap },
  ] as const
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map(({ key, value, icon: Icon }) => (
        <Card key={key} className="gap-3 py-4">
          <CardHeader className="px-4"><Icon className="size-5 text-primary" /><CardTitle className="text-sm text-muted-foreground">{t(`dashboard.${key}`)}</CardTitle></CardHeader>
          <CardContent className="px-4 text-2xl font-bold">{value}</CardContent>
        </Card>
      ))}
    </div>
  )
}
