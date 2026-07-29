import { ScheduleView } from './components/schedule-view'
import { useScheduleController } from './use-schedule-controller'

export function SchedulePage() {
  return <ScheduleView {...useScheduleController()} />
}
