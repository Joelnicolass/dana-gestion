export function formatMoney(cents: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(cents / 100)
}

export function formatStudentName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim()
}
