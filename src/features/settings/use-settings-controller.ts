import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useDataManagement } from './use-data-management'

export function useSettingsController() {
  const { t } = useTranslation()
  const actions = useDataManagement()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const paymentYear = new Date().getFullYear()

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  async function importSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await actions.importFile(file, paymentYear)
      toast.success(t('settings.imported'))
    } catch {
      toast.error(t('settings.invalidFile'))
    } finally {
      event.target.value = ''
    }
  }

  async function exportBackup() {
    await actions.exportBackup()
    toast.success(t('settings.backedUp'))
  }

  async function seedDemo() {
    await actions.seedDemo()
    toast.success(t('settings.seeded'))
  }

  async function clearData() {
    await actions.clear()
    toast.success(t('settings.cleared'))
    setClearDialogOpen(false)
  }

  return {
    fileInputRef,
    clearDialogOpen,
    onImportSelected: importSelected,
    onOpenFilePicker: openFilePicker,
    onExportBackup: exportBackup,
    onExportStudents: actions.exportStudents,
    onExportPayments: actions.exportPayments,
    onSeedDemo: seedDemo,
    onRequestClear: () => setClearDialogOpen(true),
    onCancelClear: () => setClearDialogOpen(false),
    onClearDialogChange: setClearDialogOpen,
    onClearData: clearData,
  }
}
