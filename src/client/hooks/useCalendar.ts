import { useRecoilValue } from 'recoil'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useAccount, useGlobal, useEvent } from '@client/hooks'

import { queryClient } from '@client/shared/react-query'
import { useQuery, useMutation } from 'react-query'
import { clubsQuery, createEventsMutation, deleteEventsMutation, monthlyEventsQuery } from '@client/shared/queries'

import { EventApiArg, feToBeArg, isSameDateTime, leftPadZero } from '@client/utils'
import { NexusGenObjects } from '@root/src/shared/generated/nexus-typegen'

export function useCalendar() {
  const { prev, next, today, goToDate, addEvent, getEvents, clearCalendar } = useRecoilValue(calendarState)
  const { me } = useAccount()
  const { timeSlots, setDraggableDuration, setTimeSlots } = useEvent()
  const { date, mode, setDate, enableDefaultMode, enableClubCalendarMode } = useGlobal()
  const { data } = useQuery('clubs', clubsQuery)
  const { clubs } = data ?? {}

  const { mutate: createEvents } = useMutation(createEventsMutation, {
    onSuccess: () => {
      me?.isSuper ? enableDefaultMode() : enableClubCalendarMode()
      setTimeSlots([])
      queryClient.refetchQueries(['events'])
    },
    onError: () => {
      alert('Monthly Event creation failed')
    },
  })

  const { data: monthlyEventsData } = useQuery(
    [
      'monthlyEvents',
      {
        target: date,
      },
    ],
    monthlyEventsQuery,
    {
      enabled: mode === 'setCalendar' && me?.isSuper,
    },
  )

  /** handle Calendar */
  function handlePrevWeek() {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 7)
    setDate(newDate)
    /** fullcalendar api */
    prev()
  }

  function handleNextWeek() {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 7)
    setDate(newDate)
    /** fullcalendar api */
    next()
  }

  function handleToday() {
    setDate(new Date())
    /** fullcalendar api */
    today()
  }

  function handleGoToDate(date: Date) {
    setDate(date)
    /** fullcalendar api */
    goToDate(date)
  }

  function eventReceive(info: any) {
    const { event } = info

    setTimeSlots([
      ...timeSlots,
      {
        start: event.start,
        end: event.end,
        title: event.title,
        color: event.backgroundColor,
      },
    ])
    event.remove()
  }

  function eventChange(info: any) {
    const { event } = info

    if (me?.isSuper) {
      const newTimeSlots = timeSlots.map((timeSlot, idx) => {
        if (idx.toString() === event.groupId) {
          const { start, end } = event
          return {
            ...timeSlot,
            start: [leftPadZero(start.getHours()), leftPadZero(start.getMinutes())].join(':'),
            end: [leftPadZero(end.getHours()), leftPadZero(end.getMinutes())].join(':'),
          }
        }
        return timeSlot
      })
      setTimeSlots(newTimeSlots)
    } else {
      const newTimeSlots = timeSlots.map((timeSlot, idx) => {
        if (idx.toString() === event.id) {
          return {
            ...timeSlot,
            start: event.start,
            end: event.end,
          }
        }
        return timeSlot
      })
      setTimeSlots(newTimeSlots)
    }
  }

  /** handle new monthly events; used at super's setCalendar mode */
  function renderMonthlyEvents(clubs: NexusGenObjects['Club'][]) {
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
        const startStrs = (timeSlot.start as string).split(':')
        const endStrs = (timeSlot.end as string).split(':')

        if (daysOfWeek.length === 0) return

        /** props that are not supported by fullcalendar EventApi */
        const extendedProps = {
          clubId: club.id,
          startTime: timeSlot.start + ':00',
          endTime: timeSlot.end + ':00',
          startRecur: new Date(date.getFullYear(), date.getMonth(), 1),
          endRecur: new Date(date.getFullYear(), date.getMonth() + 1, 1),
          color: club.color,
          daysOfWeek,
        }

        addEvent({
          title: club.name,
          start: new Date(
            new Date(date).setHours(
              Number(startStrs[0]), // hour
              Number(startStrs[1]), // minute
            ),
          ),
          end: new Date(
            new Date(date).setHours(
              Number(endStrs[0]), // hour
              Number(endStrs[1]), // minute
            ),
          ),
          allDay: false,
          groupId: idx.toString(),
          editable: true,

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
    const oldMonthlyEventIds = monthlyEventsData?.monthlyEvents.map(event => event.id)
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
      createEvents({ eventsInput })
    } catch (e) {
      alert('Monthly Event creation failed')
    }
  }

  function isDatesInvalid(start: Date | string, end: Date | string) {
    return !start || !end || end < start || isSameDateTime(start as Date, end as Date)
  }

  /** handle new events; used at club admin's setCalendar mode */
  function renderNewEvents() {
    const events = getEvents()

    timeSlots?.forEach((timeSlot, idx) => {
      /** update event if there is already created event */
      const target = events?.find(event => event.id === idx.toString())
      if (target) {
        if (isDatesInvalid(timeSlot.start, timeSlot.end)) {
          target.remove()
          return
        }
        target.setProp('title', timeSlot.title)
        target.setProp('color', timeSlot.color)
        target.setStart(timeSlot.start)
        target.setEnd(timeSlot.end)
        return
      }

      if (isDatesInvalid(timeSlot.start, timeSlot.end)) return
      /** if not, create new one */
      addEvent({
        id: idx,
        title: timeSlot.title,
        start: timeSlot.start as Date,
        end: timeSlot.end as Date,
        color: timeSlot.color,
      })
    })
  }

  function mutateNewEvents() {
    const isRental = mode === 'rental'
    const eventsInput = timeSlots
      ?.map(timeSlot => {
        const rentalClubId = isRental && timeSlot.rentalClubId
        const title = isRental ? timeSlot.title ?? clubs?.find(club => club.id === rentalClubId)?.name : timeSlot.title

        if (isDatesInvalid(timeSlot.start, timeSlot.end) || !timeSlot.title) return
        return { ...timeSlot, clubId: isRental ? rentalClubId : me?.club?.id, isRental, title } as EventApiArg
      })
      .filter(event => !!event)

    eventsInput?.length > 0 && createEvents({ eventsInput })
  }

  return {
    setTimeSlots,
    setDraggableDuration,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleGoToDate,
    addEvent,
    eventReceive,
    eventChange,
    renderMonthlyEvents,
    mutateMonthlyEvents,
    renderNewEvents,
    mutateNewEvents,
  }
}
