import { useAccount, useGlobal } from '@root/src/client/hooks'
import { useQuery } from 'react-query'
import { defaultEventsQuery, clubEventsQuery } from '@root/src/client/shared/queries'
import { beResponseToEventApiArg, EventApiArg, RecurringEventApiArg } from '@root/src/client/utils'

export function useCalendarDataQuery() {
  const { date, mode } = useGlobal()
  const { me } = useAccount()
  const enableDefaultCalendar = mode === 'default'
  const enableClubCalendar = mode === 'clubCalendar' || mode === 'rental' || (!!me?.club && mode === 'setCalendar')

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
      enabled: !!date && enableDefaultCalendar,
    },
  )
  const defaultEventApiArgs: RecurringEventApiArg[] =
    defaultData?.defaultEvents?.map(event => {
      const eventApiArg = beResponseToEventApiArg(event)

      if (event.isRental) {
        eventApiArg.backgroundColor = 'rgba(255, 255, 255, 0.65)'
        eventApiArg.borderColor = eventApiArg.color
        eventApiArg.textColor = eventApiArg.color
      }
      return eventApiArg
    }) ?? []

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
      enabled: !!date && enableClubCalendar,
    },
  )

  const clubEventApiArgs: EventApiArg[] | RecurringEventApiArg[] =
    clubData?.clubEvents?.map(event => {
      let eventApiArg = beResponseToEventApiArg(event)

      if (event.creator.isSuper || (event.isRental && event.club.id !== me?.club?.id)) {
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

  return events
}
