import { useRecoilState, useRecoilValue } from 'recoil'
import { globalState } from '@client/recoil/global/atoms'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useAccount } from '@client/hooks'
import { findFirstMondayOfMonth } from '@client/utils'

export function useGlobal() {
  const [global, setGlobal] = useRecoilState(globalState)
  const { me } = useAccount()
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
    setGlobal({ ...global, mode: 'rental' })
  }

  function enableDefaultMode() {
    today()
    clearCalendar()
    setGlobal({ ...global, date: new Date(), mode: 'default' })
  }

  function enableClubCalendarMode() {
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
