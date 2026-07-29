import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/form-select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { levels, type ScheduleSlot, type StudentInput } from '@/domain/types'

interface StudentFormViewProps {
  input: StudentInput
  slotIds: string[]
  slots: ScheduleSlot[]
  saving: boolean
  onFieldChange: <Key extends keyof StudentInput>(field: Key, value: StudentInput[Key]) => void
  onFeeChange: (value: string) => void
  onSlotChange: (slotId: string, checked: boolean) => void
  onSubmit: (event: FormEvent) => void
  onCancel: () => void
}

export function StudentFormView(props: StudentFormViewProps) {
  const { t } = useTranslation()
  const levelOptions = levels.map((level) => ({ value: level, label: t(`levels.${level}`) }))
  return (
    <form onSubmit={props.onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('students.firstName')} id="firstName"><Input id="firstName" value={props.input.firstName} onChange={(event) => props.onFieldChange('firstName', event.target.value)} /></Field>
        <Field label={t('students.lastName')} id="lastName"><Input id="lastName" value={props.input.lastName} onChange={(event) => props.onFieldChange('lastName', event.target.value)} /></Field>
      </div>
      <Field label={t('students.phone')} id="phone"><Input id="phone" value={props.input.phone} onChange={(event) => props.onFieldChange('phone', event.target.value)} /></Field>
      <Field label={t('students.email')} id="email"><Input id="email" type="email" value={props.input.email} onChange={(event) => props.onFieldChange('email', event.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('students.level')} id="level"><FormSelect ariaLabel={t('students.level')} value={props.input.level} options={levelOptions} onValueChange={(value) => props.onFieldChange('level', value as StudentInput['level'])} /></Field>
        <Field label={t('students.monthlyFee')} id="fee"><Input id="fee" type="number" min="0" value={props.input.monthlyFeeCents / 100 || ''} onChange={(event) => props.onFeeChange(event.target.value)} /></Field>
      </div>
      <div className="space-y-2">
        <Label>{t('students.schedule')}</Label>
        <div className="max-h-40 space-y-1 overflow-auto rounded-xl border p-2">
          {props.slots.map((slot) => (
            <label key={slot.id} className="flex min-h-11 items-center gap-3 rounded-lg px-2 hover:bg-muted">
              <Checkbox checked={props.slotIds.includes(slot.id)} onCheckedChange={(checked) => props.onSlotChange(slot.id, checked)} />
              <span className="text-sm">{t(`weekdays.${slot.weekday}`)} · {slot.startTime} · {t(`levels.${slot.level}`)}</span>
            </label>
          ))}
        </div>
      </div>
      <Field label={t('students.notes')} id="notes"><Textarea id="notes" value={props.input.notes} onChange={(event) => props.onFieldChange('notes', event.target.value)} /></Field>
      <DialogFooter className="mx-0 mb-0">
        <Button type="button" variant="outline" className="min-h-11" onClick={props.onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" className="min-h-11" disabled={props.saving}>{t('common.save')}</Button>
      </DialogFooter>
    </form>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label>{children}</div>
}
