import { SettingsView } from './components/settings-view'
import { useSettingsController } from './use-settings-controller'

export function SettingsPage() {
  return <SettingsView {...useSettingsController()} />
}
