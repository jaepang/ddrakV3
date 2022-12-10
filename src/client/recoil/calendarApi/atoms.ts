import { atom } from 'recoil'
import { EventApi } from '@fullcalendar/common'
import { RecurringEventApiArg } from '@client/utils'
import { NexusGenObjects } from '@shared/generated/nexus-typegen'

export interface CalendarApiFunctions {
  prev: () => void
  next: () => void
  today: () => void
  goToDate: (date: Date) => void
  addEvent: (event: RecurringEventApiArg & NexusGenObjects['Event']) => void
  getEvents: () => EventApi[]
  clearCalendar: () => void
}

export const calendarState = atom<CalendarApiFunctions>({
  key: 'calendarRef',
  default: {
    prev: null,
    next: null,
    today: null,
    goToDate: null,
    addEvent: null,
    getEvents: null,
    clearCalendar: null,
  },
})
