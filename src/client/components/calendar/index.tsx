import FullCalendar, { EventSourceInput, DayHeaderContentArg } from '@fullcalendar/react'
import { EventApi } from '@fullcalendar/common'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

import { useRef, useState, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { calendarState } from '@client/recoil/calendarApi/atoms'
import { useWindowSize, useAccount, useCalendar } from '@client/hooks'
import { useQuery } from 'react-query'
import { defaultEventsQuery, clubEventsQuery } from '@client/shared/queries'
import { NexusGenObjects } from '@shared/generated/nexus-typegen'
import { beResponseToEventApiArg } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/Calendar.module.css'
import draggableEventsStyles from '@components/sidebar/style/SectionMenu.module.css'
const cx = classNames.bind(styles)

export default function Calendar() {
  const [draggable, setDraggable] = useState<Draggable>(null)
  const { me } = useAccount()
  const { date, mode, draggableDuration } = useCalendar()
  const setCalendar = useSetRecoilState(calendarState)
  const ref = useRef(null)
  const { width } = useWindowSize()
  const isMobile = width <= 1024

  /** Query events before 3 months from current to 1 month after current */

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
          defaultEvents[idx] = beResponseToEventApiArg(event)
        })
      },
    },
  )

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
      enabled: !!date && mode === 'club',
      onSuccess(data) {
        const { clubEvents } = data ?? {}
        clubEvents?.forEach((event, idx) => {
          clubEvents[idx] = beResponseToEventApiArg(event)

          if (event.creator.isSuper) {
            /** gray color; unavailable */
            clubEvents[idx].color = '#777'
          }
        })
      },
    },
  )
  const events = mode === 'default' ? defaultData?.defaultEvents : clubData?.clubEvents

  useEffect(() => {
    setCalendar({ prev, next, today, goToDate, addEvent, getEvents, clearCalendar })
  }, [])

  useEffect(() => {
    if (!isMobile && mode === 'setCalendar') {
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
        <div className={cx('day', { 'set-calendar-mode': mode === 'setCalendar' })}>
          {arg.date.toLocaleString('en-Us', {
            weekday: 'short',
          })}
        </div>
        {mode !== 'setCalendar' && (
          <h2>
            {arg.date.toLocaleString('en-Us', {
              day: 'numeric',
            })}
          </h2>
        )}
      </div>
    )
  }

  return (
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
      editable={me?.isAdmin}
      droppable={me?.isAdmin}
      // eventReceive={handleEventReceive}
      // eventClick={handleEventClick}
      // eventChange={handleEventChange}
      slotDuration="00:30:00"
      // slotLabelFormat={slotLabelFormat}
      dayHeaderContent={DayHeaderContent}
      eventTimeFormat={{ hour: '2-digit', minute: '2-digit', omitZeroMinute: true, omitCommas: true }}
    />
  )
}
