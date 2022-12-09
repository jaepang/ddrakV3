import { extendType } from 'nexus'
import prisma from '@server/prisma'

export const AuthenticationQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: (_, __, ctx) => {
        return prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
        })
      },
    })
  },
})
