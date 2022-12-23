import { objectType } from 'nexus'

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.int('id')
    t.string('title')
    t.date('start')
    t.date('end')
    t.string('startTime')
    t.string('endTime')
    t.date('startRecur')
    t.date('endRecur')
    t.list.int('daysOfWeek')
    t.string('groupId')
    t.boolean('allDay')
    t.boolean('isRental')
    t.string('color')
    t.string('desc')
    t.field('creator', { type: 'User' })
    t.field('club', { type: 'Club' })
  },
})
