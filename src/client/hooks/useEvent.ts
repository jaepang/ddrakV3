import { useRecoilState } from 'recoil'
import { TimeSlot, eventState } from '@client/recoil/event/atom'

export function useEvent() {
  const [event, setEvent] = useRecoilState(eventState)

  function setDraggableDuration(draggableDuration: string) {
    setEvent({ ...event, draggableDuration })
  }

  function setTimeSlots(timeSlots: TimeSlot[]) {
    setEvent({ ...event, timeSlots })
  }

  return {
    timeSlots: event.timeSlots,
    draggableDuration: event.draggableDuration,
    setDraggableDuration,
    setTimeSlots,
  }
}
