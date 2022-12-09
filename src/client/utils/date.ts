import { leftPadZero } from './format'

export function findFirstDayOfWeek(date: Date, weekStartsOn: number): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (weekStartsOn === 1 && (day === 0 ? -6 : 1))
  return new Date(new Date(date).setDate(diff))
}

export function findLastDayOfWeek(date: Date, weekStartsOn: number): Date {
  const fisrtDayOfWeek = findFirstDayOfWeek(date, weekStartsOn)
  return new Date(fisrtDayOfWeek.setDate(fisrtDayOfWeek.getDate() + 6))
}

export function calendarHeaderDateString(date: Date, isMobile?: boolean): string {
  const longOptions: any = { month: 'long', year: 'numeric' }
  const shortOptions: any = { month: 'short', year: 'numeric' }
  const firstDayOfWeek = findFirstDayOfWeek(date, 1)
  const lastDayOfWeek = findLastDayOfWeek(date, 1)
  const yearChanged = firstDayOfWeek.getFullYear() !== lastDayOfWeek.getFullYear()
  const monthChanged = firstDayOfWeek.getMonth() !== lastDayOfWeek.getMonth()

  if (yearChanged) {
    /** year change: M YYYY - M YYYY */
    return `${firstDayOfWeek.toLocaleString('en-Us', shortOptions)} - ${lastDayOfWeek.toLocaleString(
      'en-Us',
      shortOptions,
    )}`
  } else if (monthChanged) {
    /** month change: M - M YYYY */
    return `${firstDayOfWeek.toLocaleString('en-Us', { month: 'short' })} - ${lastDayOfWeek.toLocaleString(
      'en-Us',
      shortOptions,
    )}`
  } else {
    /** default: MMM YYYY */
    return `${firstDayOfWeek.toLocaleString('en-Us', isMobile ? shortOptions : longOptions)}`
  }
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function findFirstMondayOfMonth(date: Date): Date {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  while (firstDayOfMonth.getDay() !== 1) {
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
  }

  return firstDayOfMonth
}

export function extractHourMinuteSeconds(date: Date): string {
  return [leftPadZero(date.getHours()), leftPadZero(date.getMinutes()), leftPadZero(date.getSeconds())].join(':')
}
