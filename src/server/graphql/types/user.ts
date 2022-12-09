import { objectType, enumType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.boolean('isSuper')
    t.boolean('isAdmin')
    t.string('name')
    t.list.field('events', { type: 'Event' })
    t.field('club', { type: 'Club' })
  },
})
