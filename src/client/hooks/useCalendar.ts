import { useRecoilState, useRecoilValue } from 'recoil'
import { globalState } from '@root/src/client/recoil/global/atoms'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useAccount } from './useAccount'

import { queryClient } from '@client/shared/react-query'
import { useQuery, useMutation } from 'react-query'
import { createMonthlyEventMutation, deleteEventsMutation, monthlyEventsQuery } from '@client/shared/queries'

import { feToBeArg } from '@client/utils'
import { findFirstMondayOfMonth } from '@client/utils'
import { NexusGenObjects } from '@root/src/shared/generated/nexus-typegen'

export function useCalendar() {
  const [global, setGlobal] = useRecoilState(globalState)
  const { prev, next, today, goToDate, addEvent, getEvents, clearCalendar } = useRecoilValue(calendarState)
  const { me } = useAccount()

  const { mutate: createMonthlyEvent } = useMutation(createMonthlyEventMutation, {
    onSuccess: () => {
      clearCalendar()
      enableDefaultMode()
      queryClient.refetchQueries(['events'])
    },
    onError: () => {
      alert('Monthly Event creation failed')
    },
  })

  const { data } = useQuery(
    [
      'monthlyEvents',
      {
        target: global.date,
      },
    ],
    monthlyEventsQuery,
    {
      enabled: global.mode === 'setCalendar' && me?.isSuper,
    },
  )

  /** handle global state */
  function setDraggableDuration(draggableDuration: string) {
    setGlobal({ ...global, draggableDuration })
  }

  /** handle Calendar */
  function handlePrevWeek() {
    const newDate = new Date(global.date)
    newDate.setDate(newDate.getDate() - 7)
    setGlobal({ ...global, date: newDate })
    /** fullcalendar api */
    prev()
  }

  function handleNextWeek() {
    const newDate = new Date(global.date)
    newDate.setDate(newDate.getDate() + 7)
    setGlobal({ ...global, date: newDate })
    /** fullcalendar api */
    next()
  }

  function handleToday() {
    setGlobal({ ...global, date: new Date() })
    /** fullcalendar api */
    today()
  }

  function handleGoToDate(date: Date) {
    setGlobal({ ...global, date })
    /** fullcalendar api */
    goToDate(date)
  }

  function renderMonthlyEvents(timeSlots: any[], clubs: NexusGenObjects['Club'][]) {
    /** fullcalendar api */
    clearCalendar()
    timeSlots?.forEach((timeSlot, idx) => {
      if (!timeSlot.start || !timeSlot.end) return

      clubs?.forEach(club => {
        const daysOfWeek = []
        for (let i = 0; i < 7; i++) {
          if (timeSlot.club[i] === club.name) {
            daysOfWeek.push((i + 1) % 7)
          }
        }
        const startStrs = timeSlot.start.split(':')
        const endStrs = timeSlot.end.split(':')

        if (daysOfWeek.length === 0) return

        /** props that are not supported by fullcalendar EventApi */
        const extendedProps = {
          clubId: club.id,
          startTime: timeSlot.start + ':00',
          endTime: timeSlot.end + ':00',
          startRecur: new Date(global.date.getFullYear(), global.date.getMonth(), 1),
          endRecur: new Date(global.date.getFullYear(), global.date.getMonth() + 1, 1),
          color: club.color,
          daysOfWeek,
        }

        addEvent({
          title: club.name,
          start: new Date(
            new Date(global.date).setHours(
              Number(startStrs[0]), // hour
              Number(startStrs[1]), // minute
            ),
          ),
          end: new Date(
            new Date(global.date).setHours(
              Number(endStrs[0]), // hour
              Number(endStrs[1]), // minute
            ),
          ),
          allDay: false,
          groupId: idx.toString(),

          /** for rendering */
          ...extendedProps,

          /** for saving data */
          extendedProps,
        })
      })
    })
  }

  async function mutateMonthlyEvents() {
    /** if there are remained old monthly data, remove them */
    const oldMonthlyEventIds = data?.monthlyEvents.map(event => event.id)
    const renderedEvents = getEvents()
    const clubNames = new Set(renderedEvents.map(event => event.title))
    const groupIds = new Set(renderedEvents.map(event => event.groupId))

    /** extract unique groupid and clubnames; there are duplication at render */
    const events = Array.from(groupIds).map(groupId =>
      Array.from(clubNames).map(clubName =>
        feToBeArg(renderedEvents.filter(event => event.groupId === groupId).find(event => event.title === clubName)),
      ),
    )
    const eventsInput = events.reduce((acc, cur) => [...acc, ...cur], [])

    try {
      await deleteEventsMutation({ ids: oldMonthlyEventIds })
      createMonthlyEvent({ eventsInput })
    } catch (e) {
      alert('Monthly Event creation failed')
    }
  }

  /** handle mode */
  function enableSetCalendarMode() {
    let newDate = new Date(global.date)
    if (me?.isSuper) {
      newDate = findFirstMondayOfMonth(global.date)
      goToDate(newDate)
    }
    setGlobal({ ...global, date: newDate, mode: 'setCalendar' })
  }

  function enableBorrowMode() {
    setGlobal({ ...global, mode: 'borrow' })
  }

  function enableDefaultMode() {
    today()
    setGlobal({ ...global, date: new Date(), mode: 'default' })
  }

  function enableClubCalendarMode() {
    setGlobal({ ...global, mode: 'clubCalendar' })
  }

  return {
    date: global.date,
    mode: global.mode,
    draggableDuration: global.draggableDuration,
    setDraggableDuration,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleGoToDate,
    enableSetCalendarMode,
    enableBorrowMode,
    enableDefaultMode,
    enableClubCalendarMode,
    addEvent,
    renderMonthlyEvents,
    mutateMonthlyEvents,
  }
}
