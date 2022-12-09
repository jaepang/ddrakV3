import {
  asNexusMethod,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  extendType,
  list,
  stringArg,
  intArg,
  booleanArg,
  arg,
} from 'nexus'
import { ApolloError } from 'apollo-server-micro'
import { compare, hash } from 'bcryptjs'
import { generateToken } from '@server/apollo/utils'
import prisma from '@server/prisma'

export const ClubMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createClub', {
      type: 'Club',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }, ctx) => {
        try {
          const club = await prisma.club.create({
            data: {
              name,
            },
          })
          return club
        } catch (e) {
          throw new ApolloError(e)
        }
      },
    })

    t.field('updateClub', {
      type: 'Club',
      args: {
        id: nonNull(intArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_, { id, name }, ctx) => {
        try {
          const club = await prisma.club.update({
            where: {
              id,
            },
            data: {
              name,
            },
          })
          return club
        } catch (e) {
          throw new ApolloError(e)
        }
      },
    })

    t.field('deleteClub', {
      type: 'Club',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, { id }, ctx) => {
        try {
          const club = await prisma.club.delete({
            where: {
              id,
            },
          })
          return club
        } catch (e) {
          throw new ApolloError(e)
        }
      },
    })
  },
})
