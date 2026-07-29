import * as XLSX from 'xlsx'
import { levels, weekdays, type ImportResult, type Level, type Payment, type ScheduleSlot, type Student, type Weekday } from '@/domain/types'
import { paymentRepository } from '@/repositories/payment-repository'
import { scheduleRepository } from '@/repositories/schedule-repository'
import { studentRepository } from '@/repositories/student-repository'

const HEADERS = {
  number: ['n°', 'nº', 'numero', 'número'],
  student: ['alumno', 'alumna', 'nombre completo'],
  firstName: ['nombre', 'nombres'],
  lastName: ['apellido', 'apellidos'],
  dayCount: ['cantidad de dias', 'cantidad de días'],
  days: ['dias', 'días'],
  firstSchedule: ['horario dia 1', 'horario día 1'],
  secondSchedule: ['horario dia 2', 'horario día 2'],
  schedule: ['horario', 'hora'],
  level: ['nivel'],
  fee: ['a pagar', 'cuota', 'importe', 'monto'],
  studentCount: ['cantidad de alumnos'],
  availablePlaces: ['lugares disponibles'],
  phone: ['telefono', 'teléfono', 'celular'],
  email: ['email', 'correo'],
  notes: ['notas', 'observaciones'],
} as const

const MONTH_HEADERS = [
  ['enero'], ['febrero'], ['marzo'], ['abril'], ['mayo'], ['junio'],
  ['julio'], ['agosto'], ['septiembre'], ['octubre'], ['noviembre'], ['diciembre', 'diiciembre'],
] as const

const VALUE_ALIASES: Record<string, string> = {
  inicial: 'beginner',
  principiante: 'beginner',
  intermedio: 'intermediate',
  avanzado: 'advanced',
  lunes: 'monday',
  martes: 'tuesday',
  miercoles: 'wednesday',
  jueves: 'thursday',
  viernes: 'friday',
}

type Matrix = unknown[][]
type RecordRow = Record<string, unknown>

function normalize(value: unknown) {
  return String(value ?? '').trim().toLocaleLowerCase('es')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ')
}

function matches(value: unknown, aliases: readonly string[]) {
  const candidate = normalize(value)
  return aliases.some((alias) => candidate === normalize(alias))
}

function findHeaderIndex(matrix: Matrix, requiredHeaders: readonly (readonly string[])[]) {
  return matrix.findIndex((row) => requiredHeaders.every((aliases) => row.some((cell) => matches(cell, aliases))))
}

function recordsFrom(matrix: Matrix, headerIndex: number) {
  if (headerIndex < 0) return []
  const headers = matrix[headerIndex].map(normalize)
  return matrix.slice(headerIndex + 1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  ).filter((row) => Object.values(row).some((value) => normalize(value)))
}

function read(row: RecordRow, aliases: readonly string[]) {
  return Object.entries(row).find(([header]) => aliases.some((alias) => header === normalize(alias)))?.[1]
}

function isSummaryRow(row: RecordRow) {
  const student = normalize(read(row, HEADERS.student))
  return !student || student.includes('total')
}

function parseMoney(value: unknown) {
  if (typeof value === 'number') return Math.round(value * 100)
  const text = String(value ?? '').replace(/[^\d,.-]/g, '')
  const decimalSeparator = text.lastIndexOf(',')
  const normalizedAmount = decimalSeparator >= 0
    ? `${text.slice(0, decimalSeparator).replace(/[.,]/g, '')}.${text.slice(decimalSeparator + 1)}`
    : text.replace(/[.,]/g, '')
  const amount = Number(normalizedAmount)
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}

function parseName(value: unknown) {
  const fullName = String(value ?? '').trim().replace(/\s+/g, ' ')
  if (fullName.includes(',')) {
    const [lastName, firstName] = fullName.split(',').map((part) => part.trim())
    return { firstName, lastName }
  }
  const [firstName = '', ...lastNameParts] = fullName.split(' ')
  return { firstName, lastName: lastNameParts.join(' ') }
}

function parseLevel(value: unknown): Level {
  const mapped = VALUE_ALIASES[normalize(value)]
  return levels.includes(mapped as Level) ? mapped as Level : 'beginner'
}

function parseWeekday(value: unknown): Weekday | null {
  const text = normalize(value)
  const alias = Object.keys(VALUE_ALIASES).find((candidate) => text.includes(normalize(candidate)))
  const mapped = alias ? VALUE_ALIASES[alias] : ''
  return weekdays.includes(mapped as Weekday) ? mapped as Weekday : null
}

function parseTime(value: unknown) {
  const text = normalize(value).replaceAll('.', ':')
  const matchesTime = Array.from(text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(?:hs?|h)?/g))
    .map((match) => `${match[1].padStart(2, '0')}:${match[2] ?? '00'}`)
  return matchesTime.length ? { startTime: matchesTime[0], endTime: matchesTime[1] ?? matchesTime[0] } : null
}

function createSlot(weekday: Weekday, startTime: string, endTime: string, level: Level, capacity = 5): ScheduleSlot {
  return { id: `${weekday}-${startTime}`, weekday, startTime, endTime, level, capacity }
}

function studentKey(student: Pick<Student, 'firstName' | 'lastName'>) {
  return normalize(`${student.firstName} ${student.lastName}`)
}

function parseStudentRows(rows: RecordRow[]) {
  const now = new Date().toISOString()
  return rows.filter((row) => !isSummaryRow(row)).map((row): Student => {
    const parsedName = parseName(read(row, HEADERS.student))
    return {
      id: crypto.randomUUID(),
      ...parsedName,
      phone: String(read(row, HEADERS.phone) ?? ''),
      email: String(read(row, HEADERS.email) ?? ''),
      notes: String(read(row, HEADERS.notes) ?? ''),
      level: parseLevel(read(row, HEADERS.level)),
      monthlyFeeCents: parseMoney(read(row, HEADERS.fee)),
      active: true,
      createdAt: now,
      updatedAt: now,
    }
  }).filter((student) => student.firstName)
}

export async function importSpreadsheet(file: File, paymentYear = new Date().getFullYear()): Promise<ImportResult> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
  const matrices = workbook.SheetNames.map((name) =>
    XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], { header: 1, defval: '', raw: true }) as Matrix,
  )
  const studentMatrix = matrices.find((matrix) =>
    findHeaderIndex(matrix, [HEADERS.student, HEADERS.firstSchedule, HEADERS.fee]) >= 0,
  ) ?? []
  const paymentMatrix = matrices.find((matrix) =>
    findHeaderIndex(matrix, [HEADERS.student, MONTH_HEADERS[0], MONTH_HEADERS[11]]) >= 0,
  ) ?? []
  const scheduleMatrix = matrices.find((matrix) =>
    findHeaderIndex(matrix, [HEADERS.days, HEADERS.schedule, HEADERS.availablePlaces]) >= 0,
  ) ?? []

  const studentRows = recordsFrom(studentMatrix, findHeaderIndex(studentMatrix, [HEADERS.student, HEADERS.firstSchedule, HEADERS.fee]))
  const students = parseStudentRows(studentRows)
  await studentRepository.bulkPut(students)
  const allStudents = await studentRepository.list()
  const studentsByName = new Map(allStudents.map((student) => [studentKey(student), student]))

  const slots = new Map<string, ScheduleSlot>()
  ;(await scheduleRepository.listSlots()).forEach((slot) => slots.set(slot.id, slot))
  const enrollmentSlotIds = new Map<string, string[]>()
  studentRows.filter((row) => !isSummaryRow(row)).forEach((row) => {
    const name = parseName(read(row, HEADERS.student))
    const student = studentsByName.get(studentKey(name))
    if (!student) return
    const fallbackDays = String(read(row, HEADERS.days) ?? '').split(/[,/]| y /i).map(parseWeekday).filter(Boolean) as Weekday[]
    ;[HEADERS.firstSchedule, HEADERS.secondSchedule].forEach((header, index) => {
      const value = read(row, header)
      const weekday = parseWeekday(value) ?? fallbackDays[index] ?? null
      const time = parseTime(value)
      if (!weekday || !time) return
      const slot = slots.get(`${weekday}-${time.startTime}`) ??
        createSlot(weekday, time.startTime, time.endTime, student.level)
      slots.set(slot.id, slot)
      enrollmentSlotIds.set(student.id, [...(enrollmentSlotIds.get(student.id) ?? []), slot.id])
    })
  })

  const scheduleRows = recordsFrom(scheduleMatrix, findHeaderIndex(scheduleMatrix, [HEADERS.days, HEADERS.schedule, HEADERS.availablePlaces]))
  scheduleRows.forEach((row) => {
    const weekday = parseWeekday(read(row, HEADERS.days))
    const time = parseTime(read(row, HEADERS.schedule))
    if (!weekday || !time) return
    const occupied = Number(read(row, HEADERS.studentCount))
    const available = Number(read(row, HEADERS.availablePlaces))
    const existing = slots.get(`${weekday}-${time.startTime}`)
    const capacity = Number.isFinite(occupied) && Number.isFinite(available) ? occupied + available : existing?.capacity ?? 5
    slots.set(
      `${weekday}-${time.startTime}`,
      createSlot(weekday, time.startTime, time.endTime, parseLevel(read(row, HEADERS.level)), capacity),
    )
  })
  await scheduleRepository.bulkPutSlots(Array.from(slots.values()))
  for (const [studentId, slotIds] of Array.from(enrollmentSlotIds.entries())) {
    await scheduleRepository.replaceStudentEnrollments(studentId, Array.from(new Set(slotIds)))
  }

  const paymentRows = recordsFrom(paymentMatrix, findHeaderIndex(paymentMatrix, [HEADERS.student, MONTH_HEADERS[0], MONTH_HEADERS[11]]))
  const payments: Payment[] = []
  paymentRows.filter((row) => !isSummaryRow(row)).forEach((row) => {
    const student = studentsByName.get(studentKey(parseName(read(row, HEADERS.student))))
    if (!student) return
    MONTH_HEADERS.forEach((aliases, index) => {
      const amountCents = parseMoney(read(row, aliases))
      if (!amountCents) return
      payments.push({
        id: crypto.randomUUID(),
        studentId: student.id,
        period: `${paymentYear}-${String(index + 1).padStart(2, '0')}`,
        amountCents,
        paidAt: new Date().toISOString(),
      })
    })
  })
  await paymentRepository.bulkPut(payments)
  return {
    students: students.length,
    slots: slots.size,
    enrollments: Array.from(enrollmentSlotIds.values()).reduce((total, ids) => total + ids.length, 0),
    payments: payments.length,
  }
}
