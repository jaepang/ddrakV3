import FullCalendar, { EventSourceInput } from '@fullcalendar/react'
import { EventClickArg } from '@fullcalendar/common'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

import DayHeaderContent from './DayHeaderContent'
import Modal from '@components/modal'
import EventModal from './EventModal'

import { useRef, useState, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useWindowSize, useAccount, useCalendar, useGlobal, useEvent } from '@client/hooks'
import { useCalendarDataQuery, useCalendarFunctions } from './hooks'

import classNames from 'classnames/bind'
import draggableEventsStyles from '@components/layout/shared/sidebar/style/SectionMenu.module.css'

export default function Calendar() {
  const [draggable, setDraggable] = useState<Draggable>(null)
  const [openEventModal, setOpenEventModal] = useState<boolean>(false)
  const [clickedEventId, setClickedEventId] = useState<number>(null)
  const ref = useRef<FullCalendar>(null)
  const setCalendar = useSetRecoilState(calendarState)
  const { me } = useAccount()
  const { eventReceive, eventChange } = useCalendar()
  const { mode } = useGlobal()
  const { draggableDuration } = useEvent()
  const events = useCalendarDataQuery()
  const { width } = useWindowSize()
  const isMobile = width <= 1024

  useEffect(() => {
    setCalendar(useCalendarFunctions(ref))
  }, [])

  useEffect(() => {
    if (!isMobile && !me?.isSuper && (mode === 'setCalendar' || mode === 'rental')) {
      const draggableCx = classNames.bind(draggableEventsStyles)
      const container = document.getElementById('draggable-events')

      draggable?.destroy()

      setDraggable(
        new Draggable(container, {
          itemSelector: `.${draggableCx('draggable-event')}`,
          eventData: function (eventEl) {
            return {
              title: eventEl.innerText,
              color: eventEl.style.backgroundColor,
              duration: draggableDuration,
            }
          },
        }),
      )
    }
  }, [mode, draggableDuration])

  function handleEventClick(info: EventClickArg) {
    const event = info.event
    console.log(info.el.getBoundingClientRect())
    setClickedEventId(parseInt(event.id))
    setOpenEventModal(true)
  }

  return (
    <>
      <FullCalendar
        ref={ref}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        firstDay={1}
        headerToolbar={false}
        allDaySlot={false}
        height={'calc(100vh - 70px)'}
        contentHeight={'100%'}
        events={events as EventSourceInput}
        slotMinTime="06:00:00"
        slotMaxTime="30:00:00"
        editable={me?.isAdmin || me?.isSuper}
        droppable={me?.isAdmin || me?.isSuper}
        eventReceive={eventReceive}
        eventClick={handleEventClick}
        eventDrop={eventChange}
        eventResize={eventChange}
        slotDuration="00:30:00"
        // slotLabelFormat={slotLabelFormat}
        dayHeaderContent={args => DayHeaderContent(args, me, mode)}
        eventTimeFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: true, omitCommas: true }}
      />
      <Modal onClose={() => setOpenEventModal(false)}>
        {openEventModal && <EventModal onClose={() => setOpenEventModal(false)} eventId={clickedEventId} />}
      </Modal>
    </>
  )
}
