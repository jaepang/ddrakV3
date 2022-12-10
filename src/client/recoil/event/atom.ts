import { atom } from 'recoil'

export interface TimeSlot {
  start: string | Date
  end: string | Date
  club?: string[]
  title?: string
}

interface EventState {
  timeSlots: TimeSlot[]
  draggableDuration: string
}

export const eventState = atom<EventState>({
  key: 'eventState',
  default: {
    timeSlots: [],
    draggableDuration: '02:00',
  },
})
