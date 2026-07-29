import { Pencil, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ScheduleSlot, Student } from '@/domain/types'
import { formatStudentName } from '@/lib/formatters'

export type OccupiedSlot = ScheduleSlot & { attendees: (Student | undefined)[] }

export function ScheduleList({ slots, loading, onEdit }: { slots: OccupiedSlot[]; loading: boolean; onEdit: (slot: ScheduleSlot) => void }) {
  const { t } = useTranslation()
  if (loading) return <p className="py-12 text-center text-muted-foreground">{t('common.loading')}</p>
  if (!slots.length) return <p className="py-12 text-center text-muted-foreground">{t('schedule.empty')}</p>
  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const occupancy = slot.attendees.length
        return (
          <Card key={slot.id} className="py-4"><CardContent className="space-y-3 px-4">
            <div className="flex items-start gap-3">
              <div className="flex-1"><p className="text-lg font-bold">{slot.startTime}–{slot.endTime}</p><p className="text-sm text-muted-foreground">{t(`levels.${slot.level}`)}</p></div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${occupancy >= slot.capacity ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}><Users className="mr-1 inline size-4" />{occupancy}/{slot.capacity}</span>
              <Button variant="ghost" size="icon" className="size-11" onClick={() => onEdit(slot)}><Pencil /><span className="sr-only">{t('schedule.settings')}</span></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {!slot.attendees.length
                ? <span className="text-sm text-muted-foreground">{t('schedule.noAttendees')}</span>
                : slot.attendees.map((student) => student && <span key={student.id} className="rounded-full bg-muted px-3 py-1 text-sm">{formatStudentName(student.firstName, student.lastName)}</span>)}
            </div>
          </CardContent></Card>
        )
      })}
    </div>
  )
}
