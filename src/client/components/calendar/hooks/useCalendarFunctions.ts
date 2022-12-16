import FullCalendar, { EventApi } from '@fullcalendar/react'
import { NexusGenObjects } from '@shared/generated/nexus-typegen'

export function useCalendarFunctions(ref: React.MutableRefObject<FullCalendar | undefined>) {
  /** function to use fullcalendar api; allocate these functions to global recoil state */

  /** move one week previous */
  function prev() {
    ref.current?.getApi().prev()
  }

  /** move one week next */
  function next() {
    ref.current?.getApi().next()
  }

  /** move to today */
  function today() {
    ref.current?.getApi().today()
  }

  /** go to a date */
  function goToDate(date: Date) {
    ref.current?.getApi().gotoDate(date)
  }

  /** get all events displayed on calendar */
  function getEvents() {
    return ref.current?.getApi().getEvents()
  }

  /** add event to calendar */
  function addEvent(event: NexusGenObjects['Event']) {
    const eventWithStringId = { ...event, id: event.id.toString() }
    ref.current?.getApi().addEvent(eventWithStringId)
  }

  /** remove every events displayed on calendar */
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
