import { EventApi } from '@fullcalendar/common'
import { NexusGenObjects, NexusGenInputs } from '@root/src/shared/generated/nexus-typegen'

export interface EventApiArg {
  id?: string | number
  title: string
  start: Date
  end: Date
  color?: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  desc?: string
  clubId?: number
  creatorId?: number
  className?: string
  editable?: boolean
  isRental?: boolean

  extendedProps?: {
    color?: string
    desc?: string
    clubId?: number
    creatorId?: number
  }
}

export interface RecurringEventApiArg extends EventApiArg {
  groupId?: string
  allDay?: boolean

  /** duplicated with extendedProps; we need to use this props for rendering AND we need to save them */
  startTime?: string
  endTime?: string
  startRecur?: Date
  endRecur?: Date
  daysOfWeek?: number[]

  extendedProps?: {
    startTime?: string
    endTime?: string
    startRecur?: Date
    endRecur?: Date
    daysOfWeek?: number[]
    color?: string
    desc?: string
    clubId?: number
  }
}

export function feToBeArg(feEvent: EventApi): NexusGenInputs['EventInput'] {
  return {
    title: feEvent.title,
    start: feEvent.start,
    end: feEvent.end,
    groupId: feEvent.groupId,
    allDay: feEvent.allDay,

    startTime: feEvent.extendedProps.startTime,
    endTime: feEvent.extendedProps.endTime,
    startRecur: feEvent.extendedProps.startRecur,
    endRecur: feEvent.extendedProps.endRecur,
    daysOfWeek: feEvent.extendedProps.daysOfWeek,
    color: feEvent.extendedProps.color,
    desc: feEvent.extendedProps.desc,
    clubId: feEvent.extendedProps.clubId,
  }
}

export function beResponseToEventApiArg(beEvent: NexusGenObjects['Event']): RecurringEventApiArg {
  return {
    id: beEvent.id,
    title: beEvent.title,
    start: beEvent.start,
    end: beEvent.end,
    groupId: beEvent.groupId,
    allDay: beEvent.allDay,

    startTime: beEvent.startTime,
    endTime: beEvent.endTime,
    startRecur: beEvent.startRecur,
    endRecur: beEvent.endRecur,
    daysOfWeek: beEvent.daysOfWeek.length > 0 ? beEvent.daysOfWeek : undefined,
    color: beEvent.color,
    desc: beEvent.desc,
    clubId: beEvent.club?.id,
    creatorId: beEvent.creator?.id,
    className: undefined,
    editable: false,

    extendedProps: {
      startTime: beEvent.startTime,
      endTime: beEvent.endTime,
      startRecur: beEvent.startRecur,
      endRecur: beEvent.endRecur,
      daysOfWeek: beEvent.daysOfWeek,
      color: beEvent.color,
      desc: beEvent.desc,
      clubId: beEvent.club?.id,
      creatorId: beEvent.creator?.id,
      isRental: beEvent.isRental,
    },
  } as RecurringEventApiArg
}
