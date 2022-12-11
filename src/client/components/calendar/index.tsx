import FullCalendar, { EventSourceInput, DayHeaderContentArg } from '@fullcalendar/react'
import { EventApi, EventClickArg } from '@fullcalendar/common'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

import Modal from '@components/modal'
import EventModal from './EventModal'

import { useRef, useState, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useWindowSize, useAccount, useCalendar, useGlobal, useEvent } from '@client/hooks'
import { useQuery } from 'react-query'
import { defaultEventsQuery, clubEventsQuery } from '@client/shared/queries'
import { NexusGenObjects } from '@shared/generated/nexus-typegen'
import { RecurringEventApiArg, beResponseToEventApiArg, EventApiArg } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/Calendar.module.css'
import draggableEventsStyles from '@components/layout/shared/sidebar/style/SectionMenu.module.css'
const cx = classNames.bind(styles)

export default function Calendar() {
  const [draggable, setDraggable] = useState<Draggable>(null)
  const [openEventModal, setOpenEventModal] = useState(false)
  const [clickedEventId, setClickedEventId] = useState<number>(null)
  const ref = useRef(null)
  const setCalendar = useSetRecoilState(calendarState)
  const { me } = useAccount()
  const { eventReceive, eventChange } = useCalendar()
  const { date, mode } = useGlobal()
  const { draggableDuration } = useEvent()
  const { width } = useWindowSize()
  const isMobile = width <= 1024

  /** Query events before 3 months from current to 1 month after current */

  let eventsApiArg: RecurringEventApiArg[] = []
  /** default: show monthly schedule & rental events */
  const { data: defaultData } = useQuery(
    [
      'events',
      {
        from: new Date(date.getFullYear(), date.getMonth() - 3, 1).toISOString(),
        to: new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString(),
      },
    ],
    defaultEventsQuery,
    {
      enabled: !!date && mode === 'default',
      onSuccess(data) {
        const { defaultEvents } = data ?? {}

        defaultEvents?.forEach((event, idx) => {
          const eventApiArg = beResponseToEventApiArg(event)
          eventsApiArg.push(eventApiArg)
        })
      },
    },
  )
  const defaultEventApiArgs: RecurringEventApiArg[] = defaultData?.defaultEvents?.map(beResponseToEventApiArg) ?? []

  /** club: show club events and unavailable schedule */
  const { data: clubData } = useQuery(
    [
      'events',
      {
        from: new Date(date.getFullYear(), date.getMonth() - 3, 1).toISOString(),
        to: new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString(),
      },
    ],
    clubEventsQuery,
    {
      enabled: !!date && (mode === 'clubCalendar' || (!!me?.club && mode === 'setCalendar')),
    },
  )
  const clubEventApiArgs: EventApiArg[] | RecurringEventApiArg[] =
    clubData?.clubEvents?.map(event => {
      let eventApiArg = beResponseToEventApiArg(event)

      if (event.creator.isSuper) {
        /** gray color; unavailable */
        eventApiArg.color = '#777'
        eventApiArg.editable = false
      } else {
        eventApiArg = {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.color,
          editable: false,
        }
      }
      return eventApiArg
    }) ?? []

  const events = mode === 'default' ? defaultEventApiArgs : clubEventApiArgs

  useEffect(() => {
    setCalendar({ prev, next, today, goToDate, addEvent, getEvents, clearCalendar })
  }, [])

  useEffect(() => {
    if (!isMobile && !me?.isSuper && mode === 'setCalendar') {
      const draggableCx = classNames.bind(draggableEventsStyles)
      const container = document.getElementById('draggable-events')

      /** destroy existing draggable object */
      draggable?.destroy()

      /** set new draggable object */
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
    ref.current?.getApi().addEvent(event)
  }

  /** remove every events displayed on calendar */
  function clearCalendar() {
    const events = getEvents()
    events?.forEach((event: EventApi) => {
      event.remove()
    })
  }

  function DayHeaderContent(arg: DayHeaderContentArg) {
    return (
      <div className={cx('col-header')}>
        {/** ko */}
        {/*<p>{moment(arg.date).format('ddd')}</p>
        <h2>{moment(arg.date).format('D')}</h2>*/}
        <div className={cx('day', { 'set-calendar-mode': mode === 'setCalendar' && me?.isSuper })}>
          {arg.date.toLocaleString('en-Us', {
            weekday: 'short',
          })}
        </div>
        {!(me?.isSuper && mode === 'setCalendar') && (
          <h2>
            {arg.date.toLocaleString('en-Us', {
              day: 'numeric',
            })}
          </h2>
        )}
      </div>
    )
  }

  function handleEventClick(info: EventClickArg) {
    const event = info.event
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
        dayHeaderContent={DayHeaderContent}
        eventTimeFormat={{ hour: 'numeric', minute: '2-digit', omitZeroMinute: true, omitCommas: true }}
      />
      <Modal onClose={() => setOpenEventModal(false)}>
        {openEventModal && <EventModal onClose={() => setOpenEventModal(false)} eventId={clickedEventId} />}
      </Modal>
    </>
  )
}
