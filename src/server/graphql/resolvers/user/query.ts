import { extendType } from 'nexus'
import prisma from '@server/prisma'

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {},
})
