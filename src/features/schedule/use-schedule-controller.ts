import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { levels, weekdays, type ScheduleSlot } from '@/domain/types'
import type { ScheduleSlotInput } from '@/repositories/schedule-repository'
import { useSchedule } from './use-schedule'

function emptySlot(weekday: ScheduleSlotInput['weekday']): ScheduleSlotInput {
  return {
    weekday,
    startTime: '14:00',
    endTime: '15:00',
    level: 'beginner',
    capacity: 5,
  }
}

export function useScheduleController() {
  const { t } = useTranslation()
  const schedule = useSchedule()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null)
  const [slotInput, setSlotInput] = useState<ScheduleSlotInput>(() => emptySlot(weekdays[0]))
  const [deletingSlot, setDeletingSlot] = useState<ScheduleSlot | null>(null)

  function editSlot(slot: ScheduleSlot) {
    setSelectedSlot(slot)
    setSlotInput({
      weekday: slot.weekday,
      startTime: slot.startTime,
      endTime: slot.endTime,
      level: slot.level,
      capacity: slot.capacity,
    })
    setDialogOpen(true)
  }

  function createSlot() {
    setSelectedSlot(null)
    setSlotInput(emptySlot(schedule.weekday))
    setDialogOpen(true)
  }

  async function saveSlot() {
    if (slotInput.startTime >= slotInput.endTime || slotInput.capacity < 1) {
      toast.error(t('schedule.invalid'))
      return
    }

    try {
      await schedule.saveSlot(slotInput, selectedSlot?.id)
      toast.success(t(selectedSlot ? 'schedule.updated' : 'schedule.created'))
      setDialogOpen(false)
    } catch {
      toast.error(t('schedule.duplicate'))
    }
  }

  async function deleteSlot() {
    if (!deletingSlot) return
    await schedule.deleteSlot(deletingSlot.id)
    setDeletingSlot(null)
    setDialogOpen(false)
    toast.success(t('schedule.deleted'))
  }

  function requestDelete(slot: ScheduleSlot) {
    setDialogOpen(false)
    setDeletingSlot(slot)
  }

  function updateSlot<Key extends keyof ScheduleSlotInput>(
    field: Key,
    value: ScheduleSlotInput[Key],
  ) {
    setSlotInput((current) => ({ ...current, [field]: value }))
  }

  return {
    ...schedule,
    dialogOpen,
    selectedSlot,
    slotInput,
    deletingSlot,
    levelOptions: levels.map((value) => ({ value, label: t(`levels.${value}`) })),
    weekdayOptions: weekdays.map((value) => ({ value, label: t(`weekdays.${value}`) })),
    onCreateSlot: createSlot,
    onEditSlot: editSlot,
    onSlotChange: updateSlot,
    onDialogOpenChange: setDialogOpen,
    onSaveSlot: saveSlot,
    onRequestDelete: requestDelete,
    onDeleteDialogChange: (open: boolean) => {
      if (!open) setDeletingSlot(null)
    },
    onConfirmDelete: deleteSlot,
  }
}
