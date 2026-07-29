import type { ChangeEvent, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { DataActionsCard } from './data-actions-card'
import { SettingsActions } from './settings-actions'

interface SettingsViewProps {
  fileInputRef: RefObject<HTMLInputElement | null>
  clearDialogOpen: boolean
  onImportSelected: (event: ChangeEvent<HTMLInputElement>) => void
  onOpenFilePicker: () => void
  onExportBackup: () => void
  onExportStudents: () => void
  onExportPayments: () => void
  onSeedDemo: () => void
  onRequestClear: () => void
  onCancelClear: () => void
  onClearDialogChange: (open: boolean) => void
  onClearData: () => void
}

export function SettingsView(props: SettingsViewProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      <DataActionsCard {...props} />
      <SettingsActions {...props} />
    </div>
  )
}
