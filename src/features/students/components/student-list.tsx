import { Pencil, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Student } from '@/domain/types'
import { formatMoney, formatStudentName } from '@/lib/formatters'

interface StudentListProps {
  students: Student[]
  loading: boolean
  hasSearch: boolean
  onEdit: (student: Student) => void
  onToggleActive: (student: Student) => void
}

export function StudentList({ students, loading, hasSearch, onEdit, onToggleActive }: StudentListProps) {
  const { t } = useTranslation()
  if (loading) return <p className="py-12 text-center text-muted-foreground">{t('common.loading')}</p>
  if (!students.length) return <p className="py-12 text-center text-muted-foreground">{t(hasSearch ? 'students.emptySearch' : 'students.empty')}</p>
  return (
    <div className="space-y-3">
      {students.map((student) => (
        <Card key={student.id} className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><UserRound className="size-5" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{formatStudentName(student.firstName, student.lastName)}</p>
                {!student.active && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t('common.inactive')}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{t(`levels.${student.level}`)} · {formatMoney(student.monthlyFeeCents)}</p>
            </div>
            <Button variant="ghost" size="icon" className="size-11" onClick={() => onEdit(student)}>
              <Pencil /><span className="sr-only">{t('common.edit')}</span>
            </Button>
            <Button variant="outline" className="min-h-11" onClick={() => onToggleActive(student)}>
              {t(student.active ? 'students.deactivate' : 'students.reactivate')}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
