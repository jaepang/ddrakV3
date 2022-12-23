import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { TimeSlot, eventState } from '@client/recoil/event/atom'

export function useEvent() {
  const [event, setEvent] = useRecoilState(eventState)
  const [timeSlotsValid, setTimeSlotsValid] = useState(false)

  useEffect(() => {
    setTimeSlotsValid(isTimeSlotsValid())
  }, [event.timeSlots])

  function setDraggableDuration(draggableDuration: string) {
    setEvent({ ...event, draggableDuration })
  }

  function setTimeSlots(timeSlots: TimeSlot[]) {
    setEvent({ ...event, timeSlots })
  }

  function isTimeSlotsValid() {
    if (event.timeSlots.length === 0) return false

    for (const timeSlot of event.timeSlots) {
      if (!timeSlot.start || !timeSlot.end || timeSlot.end <= timeSlot.start) continue

      if (timeSlot.club) {
        for (const club of timeSlot.club) {
          if (club) {
            return true
          }
        }
      } else if (timeSlot.title) {
        return true
      }
    }

    return false
  }

  return {
    timeSlots: event.timeSlots,
    draggableDuration: event.draggableDuration,
    setDraggableDuration,
    setTimeSlots,
    timeSlotsValid,
  }
}
