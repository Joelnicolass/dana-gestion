import { Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { ScheduleSlot, Student } from '@/domain/types'
import type { useStudentForm } from '../use-student-form'
import { StudentFormView } from './student-form-view'
import { StudentList } from './student-list'

interface StudentsViewProps {
  students: Student[]
  loading: boolean
  search: string
  slots: ScheduleSlot[]
  dialogOpen: boolean
  editingStudent: Student | null
  form: ReturnType<typeof useStudentForm>
  onSearchChange: (value: string) => void
  onCreate: () => void
  onEdit: (student: Student) => void
  onToggleActive: (student: Student) => void
  onDialogOpenChange: (open: boolean) => void
  onCloseDialog: () => void
}

export function StudentsView(props: StudentsViewProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('students.title')}</h1>
        <Button className="min-h-11" onClick={props.onCreate}><Plus />{t('students.add')}</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
        <Input className="h-11 pl-9" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder={t('students.search')} />
      </div>
      <StudentList students={props.students} loading={props.loading} hasSearch={Boolean(props.search)} onEdit={props.onEdit} onToggleActive={props.onToggleActive} />
      <Dialog open={props.dialogOpen} onOpenChange={props.onDialogOpenChange}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{t(props.editingStudent ? 'students.editTitle' : 'students.createTitle')}</DialogTitle></DialogHeader>
          <StudentFormView
            input={props.form.input}
            slotIds={props.form.slotIds}
            saving={props.form.saving}
            slots={props.slots}
            onFieldChange={props.form.updateField}
            onFeeChange={props.form.updateFee}
            onSlotChange={props.form.toggleSlot}
            onSubmit={props.form.submit}
            onCancel={props.onCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
