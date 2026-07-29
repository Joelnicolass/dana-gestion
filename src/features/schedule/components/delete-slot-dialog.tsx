import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ScheduleSlot } from '@/domain/types'

interface DeleteSlotDialogProps {
  slot: ScheduleSlot | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteSlotDialog({
  slot,
  onOpenChange,
  onConfirm,
}: DeleteSlotDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={Boolean(slot)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('schedule.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('schedule.deleteDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => onOpenChange(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            className="min-h-11"
            onClick={onConfirm}
          >
            {t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
