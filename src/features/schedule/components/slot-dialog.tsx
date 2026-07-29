import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FormSelect, type SelectOption } from '@/components/form-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ScheduleSlot } from '@/domain/types'
import type { ScheduleSlotInput } from '@/repositories/schedule-repository'

interface SlotDialogProps {
  open: boolean
  selectedSlot: ScheduleSlot | null
  input: ScheduleSlotInput
  levelOptions: SelectOption[]
  weekdayOptions: SelectOption[]
  onChange: <Key extends keyof ScheduleSlotInput>(
    field: Key,
    value: ScheduleSlotInput[Key],
  ) => void
  onOpenChange: (open: boolean) => void
  onSave: () => void
  onDelete: (slot: ScheduleSlot) => void
}

export function SlotDialog(props: SlotDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(props.selectedSlot ? 'schedule.editTitle' : 'schedule.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label>{t('schedule.weekday')}</Label>
            <FormSelect
              ariaLabel={t('schedule.weekday')}
              value={props.input.weekday}
              options={props.weekdayOptions}
              onValueChange={(value) =>
                props.onChange('weekday', value as ScheduleSlotInput['weekday'])
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="startTime">{t('schedule.startTime')}</Label>
            <Input
              id="startTime"
              type="time"
              value={props.input.startTime}
              onChange={(event) => props.onChange('startTime', event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endTime">{t('schedule.endTime')}</Label>
            <Input
              id="endTime"
              type="time"
              value={props.input.endTime}
              onChange={(event) => props.onChange('endTime', event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('schedule.level')}</Label>
            <FormSelect
              ariaLabel={t('schedule.level')}
              value={props.input.level}
              options={props.levelOptions}
              onValueChange={(value) =>
                props.onChange('level', value as ScheduleSlotInput['level'])
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="capacity">{t('schedule.capacity')}</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={props.input.capacity}
              onChange={(event) =>
                props.onChange('capacity', Number(event.target.value))
              }
            />
          </div>
        </div>
        <DialogFooter>
          {props.selectedSlot && (
            <DeleteSlotButton slot={props.selectedSlot} onDelete={props.onDelete} />
          )}
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => props.onOpenChange(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button className="min-h-11" onClick={props.onSave}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteSlotButton({
  slot,
  onDelete,
}: {
  slot: ScheduleSlot
  onDelete: (slot: ScheduleSlot) => void
}) {
  const { t } = useTranslation()
  return (
    <Button
      variant="destructive"
      className="min-h-11 sm:mr-auto"
      onClick={() => onDelete(slot)}
    >
      <Trash2 />
      {t('common.delete')}
    </Button>
  )
}
