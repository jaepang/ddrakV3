import { objectType, enumType } from 'nexus'

export const Club = objectType({
  name: 'Club',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('color')
    t.list.field('members', { type: 'User' })
    t.list.field('events', { type: 'Event' })
  },
})
