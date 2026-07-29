export const levels = ['beginner', 'intermediate', 'advanced'] as const
export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

export type Level = (typeof levels)[number]
export type Weekday = (typeof weekdays)[number]

export interface Student {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  notes: string
  level: Level
  monthlyFeeCents: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ScheduleSlot {
  id: string
  weekday: Weekday
  startTime: string
  endTime: string
  level: Level
  capacity: number
}

export interface Enrollment {
  id: string
  studentId: string
  slotId: string
  createdAt: string
}

export interface Payment {
  id: string
  studentId: string
  period: string
  amountCents: number
  paidAt: string
}

export type StudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>

export interface AppBackup {
  version: 1
  exportedAt: string
  students: Student[]
  slots: ScheduleSlot[]
  enrollments: Enrollment[]
  payments: Payment[]
}

export interface ImportResult {
  students: number
  slots: number
  enrollments: number
  payments: number
}
