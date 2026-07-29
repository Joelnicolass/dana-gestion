import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SelectOption } from '@/components/form-select'
import { Button } from '@/components/ui/button'
import type { ScheduleSlot, Weekday } from '@/domain/types'
import type { ScheduleSlotInput } from '@/repositories/schedule-repository'
import { DayFilter } from './day-filter'
import { DeleteSlotDialog } from './delete-slot-dialog'
import { ScheduleList, type OccupiedSlot } from './schedule-list'
import { SlotDialog } from './slot-dialog'

interface ScheduleViewProps {
  weekday: Weekday
  slots: OccupiedSlot[]
  loading: boolean
  dialogOpen: boolean
  selectedSlot: ScheduleSlot | null
  deletingSlot: ScheduleSlot | null
  slotInput: ScheduleSlotInput
  levelOptions: SelectOption[]
  weekdayOptions: SelectOption[]
  setWeekday: (day: Weekday) => void
  onCreateSlot: () => void
  onEditSlot: (slot: ScheduleSlot) => void
  onSlotChange: <Key extends keyof ScheduleSlotInput>(
    field: Key,
    value: ScheduleSlotInput[Key],
  ) => void
  onDialogOpenChange: (open: boolean) => void
  onSaveSlot: () => void
  onRequestDelete: (slot: ScheduleSlot) => void
  onDeleteDialogChange: (open: boolean) => void
  onConfirmDelete: () => void
}

export function ScheduleView(props: ScheduleViewProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('schedule.title')}</h1>
        <Button className="min-h-11" onClick={props.onCreateSlot}>
          <Plus />
          {t('schedule.add')}
        </Button>
      </div>
      <DayFilter weekday={props.weekday} onChange={props.setWeekday} />
      <ScheduleList slots={props.slots} loading={props.loading} onEdit={props.onEditSlot} />
      <SlotDialog
        open={props.dialogOpen}
        selectedSlot={props.selectedSlot}
        input={props.slotInput}
        levelOptions={props.levelOptions}
        weekdayOptions={props.weekdayOptions}
        onChange={props.onSlotChange}
        onOpenChange={props.onDialogOpenChange}
        onSave={props.onSaveSlot}
        onDelete={props.onRequestDelete}
      />
      <DeleteSlotDialog
        slot={props.deletingSlot}
        onOpenChange={props.onDeleteDialogChange}
        onConfirm={props.onConfirmDelete}
      />
    </div>
  )
}
