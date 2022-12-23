import { useRecoilState, useRecoilValue } from 'recoil'
import { globalState } from '@client/recoil/global/atoms'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useAccount, useEvent } from '@client/hooks'
import { findFirstMondayOfMonth } from '@client/utils'

export function useGlobal() {
  const [global, setGlobal] = useRecoilState(globalState)
  const { me } = useAccount()
  const { setTimeSlots } = useEvent()
  const { today, goToDate, clearCalendar } = useRecoilValue(calendarState)

  function setDate(date: Date) {
    setGlobal({ ...global, date })
  }

  function enableSetCalendarMode() {
    let newDate = new Date(global.date)
    if (me?.isSuper) {
      newDate = findFirstMondayOfMonth(global.date)
      goToDate(newDate)
    }
    setGlobal({ ...global, date: newDate, mode: 'setCalendar' })
  }

  function enableRentalMode() {
    clearCalendar()
    setGlobal({ ...global, mode: 'rental' })
  }

  function enableDefaultMode() {
    today()
    clearCalendar()
    setTimeSlots([])
    setGlobal({ ...global, date: new Date(), mode: 'default' })
  }

  function enableClubCalendarMode() {
    clearCalendar()
    setGlobal({ ...global, mode: 'clubCalendar' })
  }

  return {
    date: global.date,
    mode: global.mode,
    setDate,
    enableDefaultMode,
    enableSetCalendarMode,
    enableRentalMode,
    enableClubCalendarMode,
  }
}
