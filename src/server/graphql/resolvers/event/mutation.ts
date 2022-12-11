import { nonNull, extendType, list, intArg, arg } from 'nexus'
import { ApolloError } from 'apollo-server-micro'
import prisma from '@server/prisma'

export const EventMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSingleEvent', {
      type: 'Event',
      args: {
        eventInput: nonNull(arg({ type: 'EventInput' })),
      },
      resolve: async (_, { eventInput }, ctx) => {
        try {
          const event = await prisma.event.create({
            data: {
              title: eventInput.title,
              start: eventInput.start,
              end: eventInput.end,
              startTime: eventInput.startTime,
              endTime: eventInput.endTime,
              startRecur: eventInput.startRecur,
              endRecur: eventInput.endRecur,
              daysOfWeek: eventInput.daysOfWeek,
              groupId: eventInput.groupId,
              allDay: eventInput.allDay,
              color: eventInput.color,
              desc: eventInput.desc,

              creator: {
                connect: {
                  id: ctx.userId,
                },
              },
              club: {
                connect: {
                  id: eventInput.clubId,
                },
              },
            },
          })
          return event
        } catch (e) {
          throw new ApolloError(e.message)
        }
      },
    })

    t.int('createEvents', {
      args: {
        eventsInput: list(arg({ type: 'EventInput' })),
      },
      resolve: async (_, { eventsInput }, ctx) => {
        try {
          const createManyBatch = await prisma.event.createMany({
            data: eventsInput.map(event => ({
              title: event.title,
              start: event.start,
              end: event.end,
              startTime: event.startTime,
              endTime: event.endTime,
              startRecur: event.startRecur,
              endRecur: event.endRecur,
              daysOfWeek: event.daysOfWeek,
              groupId: event.groupId,
              allDay: event.allDay,
              color: event.color,
              desc: event.desc,

              clubId: event.clubId,
              creatorId: ctx.userId,
            })),
          })
          return createManyBatch.count
        } catch (e) {
          throw new ApolloError(e.message)
        }
      },
    })

    t.field('updateEvent', {
      type: 'Event',
      args: {
        id: nonNull(intArg()),
        eventInput: nonNull(arg({ type: 'EventInput' })),
      },
      resolve: async (_, { id, eventInput }, ctx) => {
        try {
          const event = await prisma.event.update({
            where: {
              id,
            },
            data: {
              title: eventInput.title,
              start: eventInput.start,
              end: eventInput.end,
              startTime: eventInput.startTime,
              endTime: eventInput.endTime,
              startRecur: eventInput.startRecur,
              endRecur: eventInput.endRecur,
              daysOfWeek: eventInput.daysOfWeek,
              groupId: eventInput.groupId,
              allDay: eventInput.allDay,
              color: eventInput.color,
              desc: eventInput.desc,
              clubId: eventInput.clubId,
            },
          })
          return event
        } catch (e) {
          throw new ApolloError(e.message)
        }
      },
    })

    t.field('deleteEvent', {
      type: 'Event',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, { id }, ctx) => {
        try {
          const event = await prisma.event.delete({
            where: {
              id,
            },
          })
          return event
        } catch (e) {
          throw new ApolloError(e.message)
        }
      },
    })

    t.int('deleteEvents', {
      args: {
        ids: list(intArg()),
      },
      resolve: async (_, { ids }, ctx) => {
        try {
          const deleteManyBatch = await prisma.event.deleteMany({
            where: {
              id: {
                in: ids,
              },
            },
          })
          return deleteManyBatch.count
        } catch (e) {
          throw new ApolloError(e.message)
        }
      },
    })
  },
})
