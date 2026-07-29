import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'

const DashboardPage = lazy(() => import('@/features/dashboard/dashboard-page').then((module) => ({ default: module.DashboardPage })))
const StudentsPage = lazy(() => import('@/features/students/students-page').then((module) => ({ default: module.StudentsPage })))
const PaymentsPage = lazy(() => import('@/features/payments/payments-page').then((module) => ({ default: module.PaymentsPage })))
const SchedulePage = lazy(() => import('@/features/schedule/schedule-page').then((module) => ({ default: module.SchedulePage })))
const SettingsPage = lazy(() => import('@/features/settings/settings-page').then((module) => ({ default: module.SettingsPage })))

function RouteLoading() {
  const { t } = useTranslation()
  return <p className="py-16 text-center text-muted-foreground">{t('common.loading')}</p>
}

function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
