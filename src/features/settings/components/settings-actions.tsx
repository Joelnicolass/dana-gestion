import { Sparkles, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SettingsActionsProps {
  clearDialogOpen: boolean
  onSeedDemo: () => void
  onRequestClear: () => void
  onCancelClear: () => void
  onClearDialogChange: (open: boolean) => void
  onClearData: () => void
}

export function SettingsActions(props: SettingsActionsProps) {
  const { t } = useTranslation()
  return (
    <>
      <Card>
        <CardHeader><Sparkles className="size-6 text-primary" /><CardTitle>{t('settings.demo')}</CardTitle><CardDescription>{t('settings.demoDescription')}</CardDescription></CardHeader>
        <CardContent><Button className="min-h-12 w-full" onClick={props.onSeedDemo}>{t('settings.demo')}</Button></CardContent>
      </Card>
      <Card className="border-destructive/30">
        <CardHeader><Trash2 className="size-6 text-destructive" /><CardTitle>{t('settings.danger')}</CardTitle></CardHeader>
        <CardContent><Button variant="destructive" className="min-h-12 w-full" onClick={props.onRequestClear}>{t('settings.clear')}</Button></CardContent>
      </Card>
      <Dialog open={props.clearDialogOpen} onOpenChange={props.onClearDialogChange}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('settings.clearTitle')}</DialogTitle><DialogDescription>{t('settings.clearDescription')}</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="min-h-11" onClick={props.onCancelClear}>{t('common.cancel')}</Button>
            <Button variant="destructive" className="min-h-11" onClick={props.onClearData}>{t('common.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
