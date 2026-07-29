import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import type { Level, Weekday } from '@/domain/types'

interface NextSlot {
  id: string
  weekday: Weekday
  startTime: string
  endTime: string
  level: Level
  occupancy: number
  capacity: number
}

export function NextClasses({ slots }: { slots: NextSlot[] }) {
  const { t } = useTranslation()
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t('dashboard.nextClasses')}</h2>
      {!slots.length && <p className="text-sm text-muted-foreground">{t('dashboard.noClasses')}</p>}
      {slots.map((slot) => (
        <Card key={slot.id} className="py-4"><CardContent className="flex items-center justify-between px-4">
          <div><p className="font-semibold">{t(`weekdays.${slot.weekday}`)}</p><p className="text-sm text-muted-foreground">{slot.startTime}–{slot.endTime} · {t(`levels.${slot.level}`)}</p></div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{slot.occupancy}/{slot.capacity}</span>
        </CardContent></Card>
      ))}
    </section>
  )
}
