import { StudentsView } from './components/students-view'
import { useStudentsController } from './use-students-controller'

export function StudentsPage() {
  return <StudentsView {...useStudentsController()} />
}
