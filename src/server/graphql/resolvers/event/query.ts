import { extendType, arg, intArg, stringArg } from 'nexus'
import prisma from '@server/prisma'

export const EventQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('event', {
      type: 'Event',
      args: {
        id: 'Int',
      },
      resolve: async (_parent, { id }, _ctx) => {
        return await prisma.event.findUnique({
          where: { id },
          include: {
            club: true,
            creator: true,
          },
        })
      },
    })

    t.list.field('events', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
        clubId: intArg(),
      },
      resolve: async (_parent, { from, to, clubId }, _ctx) => {
        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
              lte: to,
            },
            club: {
              id: clubId,
            },
          },
          include: {
            club: true,
            creator: true,
          },
        })
      },
    })

    t.list.field('defaultEvents', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { from, to }, _ctx): Promise<any> => {
        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
              lte: to,
            },
            OR: [
              {
                creator: {
                  isSuper: true,
                },
              },
              {
                isRental: true,
              },
            ],
          },
          include: {
            club: true,
            creator: true,
          },
        })
      },
    })

    t.list.field('clubEvents', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { from, to }, ctx) => {
        const me = await prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
          include: {
            club: true,
          },
        })

        return await prisma.event.findMany({
          where: {
            /** club internal events created by club admin */
            OR: [
              {
                start: {
                  gte: from,
                  lte: to,
                },
                creator: {
                  // isAdmin: true,
                  club: {
                    id: me.club.id,
                  },
                },
              },
              /** monthly events whose club is not user's; Thus not available */
              {
                start: {
                  gte: from,
                  lte: to,
                },
                creator: {
                  isSuper: true,
                },
                club: {
                  NOT: {
                    id: me.club.id,
                  },
                },
              },
            ],
          },
          include: {
            club: true,
            creator: true,
          },
        })
      },
    })

    t.list.field('monthlyEvents', {
      type: 'Event',
      args: {
        target: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { target }, _ctx) => {
        const from = new Date(target.getFullYear(), target.getMonth(), 1)
        const to = new Date(target.getFullYear(), target.getMonth() + 1, 0)

        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
            },
            end: {
              lte: to,
            },
            creator: {
              isSuper: true,
            },
          },
        })
      },
    })
  },
})
