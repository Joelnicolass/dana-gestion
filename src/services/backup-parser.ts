import type { AppBackup } from '@/domain/types'

export function parseBackup(source: string): AppBackup {
  const value: unknown = JSON.parse(source)
  if (!isBackup(value)) throw new Error('Invalid backup structure')
  return value
}

function isBackup(value: unknown): value is AppBackup {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return candidate.version === 1 &&
    typeof candidate.exportedAt === 'string' &&
    isEntityArray(candidate.students) &&
    isEntityArray(candidate.slots) &&
    isEntityArray(candidate.enrollments) &&
    isEntityArray(candidate.payments)
}

function isEntityArray(value: unknown): value is Array<{ id: string }> {
  return Array.isArray(value) && value.every((item) =>
    Boolean(item) && typeof item === 'object' && typeof (item as Record<string, unknown>).id === 'string',
  )
}
