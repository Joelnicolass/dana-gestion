import { DashboardView } from './components/dashboard-view'
import { useDashboardController } from './use-dashboard-controller'

export function DashboardPage() {
  return <DashboardView {...useDashboardController()} />
}
