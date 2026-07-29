import { useTranslation } from 'react-i18next'
import type { useDashboard } from '../use-dashboard'
import { MetricGrid } from './metric-grid'
import { NextClasses } from './next-classes'

type DashboardData = NonNullable<ReturnType<typeof useDashboard>['data']>

export function DashboardView({ data, loading }: { data: DashboardData | undefined; loading: boolean }) {
  const { t } = useTranslation()
  if (loading || !data) return <p className="py-16 text-center text-muted-foreground">{t('common.loading')}</p>
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{t('dashboard.title')}</h1><p className="text-muted-foreground">{t('dashboard.greeting')}</p></div>
      <MetricGrid {...data} />
      <NextClasses slots={data.nextSlots} />
    </div>
  )
}
