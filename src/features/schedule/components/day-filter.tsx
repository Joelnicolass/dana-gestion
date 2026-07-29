import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { weekdays, type Weekday } from '@/domain/types'

export function DayFilter({ weekday, onChange }: { weekday: Weekday; onChange: (day: Weekday) => void }) {
  const { t } = useTranslation()
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {weekdays.map((day) => (
        <Button key={day} variant={weekday === day ? 'default' : 'outline'} className="min-h-11 shrink-0" onClick={() => onChange(day)}>
          {t(`weekdays.${day}`)}
        </Button>
      ))}
    </div>
  )
}
