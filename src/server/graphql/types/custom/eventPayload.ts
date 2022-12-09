import { inputObjectType } from 'nexus'

export const EventInput = inputObjectType({
  name: 'EventInput',
  definition(t) {
    t.nonNull.string('title')
    t.date('start')
    t.date('end')
    t.string('startTime')
    t.string('endTime')
    t.date('startRecur')
    t.date('endRecur')
    t.list.int('daysOfWeek')
    t.string('groupId')
    t.boolean('allDay')
    t.string('color')
    t.string('desc')
    t.int('clubId')
  },
})
