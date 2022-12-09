import { atom } from 'recoil'

export interface Global {
  date: Date
  mode: 'default' | 'clubCalendar' | 'borrow' | 'setCalendar'
  draggableDuration: string
}

export const globalState = atom<Global>({
  key: 'global',
  default: {
    date: new Date(),
    mode: 'default',
    draggableDuration: '02:00',
  },
})
