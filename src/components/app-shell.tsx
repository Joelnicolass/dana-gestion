import { CalendarDays, CreditCard, GraduationCap, Home, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const items = [
  { path: '/', key: 'dashboard', icon: Home, end: true },
  { path: '/students', key: 'students', icon: GraduationCap },
  { path: '/payments', key: 'payments', icon: CreditCard },
  { path: '/schedule', key: 'schedule', icon: CalendarDays },
  { path: '/settings', key: 'settings', icon: Settings },
] as const

export function AppShell() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto min-h-dvh max-w-3xl bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">D</div>
          <div>
            <p className="font-heading text-lg font-semibold leading-tight">{t('app.name')}</p>
            <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
          </div>
        </div>
      </header>
      <main className="px-4 pb-28 pt-5"><Outlet /></main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-3xl border-t bg-background/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="grid grid-cols-5">
          {items.map(({ path, key, icon: Icon, ...item }) => (
            <NavLink
              key={path}
              to={path}
              end={'end' in item ? item.end : false}
              className={({ isActive }) => cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium text-muted-foreground',
                isActive && 'bg-primary/10 text-primary',
              )}
            >
              <Icon className="size-5" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
