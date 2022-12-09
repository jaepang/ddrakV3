import { extendType, arg, intArg } from 'nexus'
import prisma from '@server/prisma'

export const ClubQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('club', {
      type: 'Club',
      args: {
        id: 'Int',
      },
      resolve: async (_parent, { id }, _ctx) => {
        return await prisma.club.findUnique({
          where: { id },
        })
      },
    })

    t.list.field('clubs', {
      type: 'Club',
      resolve: async (_parent, _args, _ctx) => {
        return await prisma.club.findMany()
      },
    })
  },
})
