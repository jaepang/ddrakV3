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

  /** default: show monthly schedule & rental events */
  const { data: defaultData, isLoading: defaultLoading } = useQuery(
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
  const { data: clubData, isLoading: clubLoading } = useQuery(
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

  const clubEventApiArgs: EventApiArg[] =
    clubData?.clubEvents?.map(event => {
      let eventApiArg = beResponseToEventApiArg(event)

      if (event.creator.isSuper) {
        /** gray color; unavailable */
        eventApiArg.color = '#777'
      } else if (event.isRental && event?.club?.id !== me?.club?.id) {
        eventApiArg.backgroundColor = '#eee'
        eventApiArg.borderColor = '#777'
        eventApiArg.textColor = '#777'
      }
      return eventApiArg
    }) ?? []

  const events = mode === 'default' ? defaultEventApiArgs : clubEventApiArgs
  const isEventsLoading = mode === 'default' ? defaultLoading : clubLoading

  return {
    events,
    isEventsLoading,
  }
}
