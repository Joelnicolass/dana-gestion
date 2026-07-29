import { Database, Download, FileDown, FileUp } from 'lucide-react'
import type { ChangeEvent, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DataActionsCardProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  onImportSelected: (event: ChangeEvent<HTMLInputElement>) => void
  onOpenFilePicker: () => void
  onExportBackup: () => void
  onExportStudents: () => void
  onExportPayments: () => void
}

export function DataActionsCard(props: DataActionsCardProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader><Database className="size-6 text-primary" /><CardTitle>{t('settings.data')}</CardTitle><CardDescription>{t('settings.dataDescription')}</CardDescription></CardHeader>
      <CardContent className="grid gap-3">
        <Button variant="outline" className="min-h-12 justify-start" onClick={props.onExportBackup}><Download />{t('settings.backup')}</Button>
        <input ref={props.fileInputRef} className="hidden" type="file" accept=".json,.xlsx,.xls,.csv" onChange={props.onImportSelected} />
        <Button variant="outline" className="min-h-12 justify-start" onClick={props.onOpenFilePicker}><FileUp />{t('settings.import')}</Button>
        <p className="-mt-1 px-1 text-xs text-muted-foreground">{t('settings.importHelp')}</p>
        <Button variant="outline" className="min-h-12 justify-start" onClick={props.onExportStudents}><FileDown />{t('settings.exportStudents')}</Button>
        <Button variant="outline" className="min-h-12 justify-start" onClick={props.onExportPayments}><FileDown />{t('settings.exportPayments')}</Button>
      </CardContent>
    </Card>
  )
}
