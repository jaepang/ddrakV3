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

export const AuthenticationMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
        clubId: intArg(),
        isAdmin: booleanArg(),
      },
      resolve: async (_, { name, password, clubId, isAdmin }, ctx) => {
        try {
          const hashedPassword = await hash(password, 10)

          /** search user by name */
          const existingUser = await prisma.user.findUnique({
            where: {
              name,
            },
          })

          if (!existingUser) {
            const data = {
              name,
              password: hashedPassword,
              club: undefined,
              isAdmin,
            }

            try {
              if (clubId) {
                data.club = {
                  connect: {
                    id: clubId,
                  },
                }
              }
              const user = await prisma.user.create({
                data,
              })

              const token = generateToken({ userId: user.id })

              return {
                token,
                user,
              }
            } catch (e) {
              console.log(e)
            }
          } else {
            const user = await prisma.user.update({
              where: {
                name,
              },
              data: {
                name,
                password: hashedPassword,
              },
            })

            const token = generateToken({ userId: user.id })

            return {
              token,
              user,
            }
          }
        } catch (e: any) {
          if (e.code === 'P2002') {
            throw new ApolloError('Duplicate name')
          }
          throw new ApolloError('Signup failed')
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { name, password }, ctx) => {
        /** search user by name */
        const user = await prisma.user.findUnique({
          where: {
            name,
          },
        })
        if (!user) {
          throw new ApolloError('User not found', null, {
            extraCode: 'USER_NOT_FOUND',
          })
        }

        /** compare password */
        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) {
          throw new ApolloError('Invalid password', null, {
            extraCode: 'INVALID_PASSWORD',
          })
        }

        /** generate token and return */
        const token = generateToken({ userId: user.id })
        return {
          token,
          user,
        }
      },
    })

    t.field('updateUser', {
      type: 'User',
      args: {
        id: nonNull(intArg()),
        name: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, { id, name, password }, ctx) => {
        let hashedPassword = undefined

        if (password) {
          hashedPassword = await hash(password, 10)
        }

        return prisma.user.update({
          where: {
            id,
          },
          data: {
            name,
            password: hashedPassword,
          },
        })
      },
    })

    t.field('changePassword', {
      type: 'AuthPayload',
      args: {
        id: nonNull(intArg()),
        password: nonNull(stringArg()),
        newPassword: nonNull(stringArg()),
      },
      resolve: async (_, { id, password, newPassword }, ctx) => {
        let user = null
        try {
          user = await prisma.user.findUnique({
            where: {
              id,
            },
          })
        } catch (e) {
          throw Error('invalid_user')
        }

        if (!user) {
          throw Error('invalid_user')
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw Error('invalid_password')
        }
        const hashedPassword = await hash(newPassword, 10)
        user = await prisma.user.update({
          where: { id },
          data: {
            password: hashedPassword,
          },
        })
        const token = generateToken({ userId: user.id })
        return {
          token,
          user,
        }
      },
    })
  },
})
