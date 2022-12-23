import FullCalendar, { EventApi } from '@fullcalendar/react'
import { NexusGenObjects } from '@shared/generated/nexus-typegen'

export function useCalendarFunctions(ref: React.MutableRefObject<FullCalendar | undefined>) {
  function prev() {
    ref.current?.getApi().prev()
  }

  function next() {
    ref.current?.getApi().next()
  }

  function today() {
    ref.current?.getApi().today()
  }

  function goToDate(date: Date) {
    ref.current?.getApi().gotoDate(date)
  }

  function getEvents() {
    return ref.current?.getApi().getEvents()
  }

  function addEvent(event: NexusGenObjects['Event']) {
    const eventWithStringId = { ...event, id: event.id?.toString() }
    ref.current?.getApi().addEvent(eventWithStringId)
  }

  function clearCalendar() {
    const events = getEvents()
    events?.forEach((event: EventApi) => {
      event.remove()
    })
  }

  return {
    prev,
    next,
    today,
    goToDate,
    getEvents,
    addEvent,
    clearCalendar,
  }
}
