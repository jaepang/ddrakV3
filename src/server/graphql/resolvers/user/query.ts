import { extendType, nonNull, intArg } from 'nexus'
import prisma from '@server/prisma'

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, { id }, ctx) => {
        return await prisma.user.findUnique({
          where: {
            id,
          },
        })
      },
    })
  },
})
