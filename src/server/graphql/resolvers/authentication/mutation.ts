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
import { sendPasswordRecoveryEmail } from './utils'

export const AuthenticationMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
        clubName: stringArg(),
      },
      resolve: async (_, { name, password, clubName }, ctx) => {
        try {
          const hashedPassword = await hash(password, 10)

          // 이메일로 유저 검색
          const existingUser = await prisma.user.findUnique({
            where: {
              name,
            },
          })

          if (!existingUser) {
            // 탈퇴한 적 없고 신규 유저라면
            const data = {
              name,
              password: hashedPassword,
              club: undefined,
            }

            try {
              if (clubName) {
                const club = await prisma.club.findUnique({
                  where: {
                    name: clubName ?? 'undefined',
                  },
                })
                data.club = {
                  connect: {
                    id: club?.id,
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
            // 탈퇴한 적 있다면
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
        // 이메일로 유저 검색
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

        // 패스워드 비교
        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) {
          throw new ApolloError('Invalid password', null, {
            extraCode: 'INVALID_PASSWORD',
          })
        }

        // 토큰 생성 후 전달
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

    t.field('passwordRecovery', {
      type: 'Boolean',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }, ctx) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              name,
            },
          })

          if (!user) {
            throw new ApolloError('USER_NOT_FOUND')
          }

          return await sendPasswordRecoveryEmail(user)
        } catch (e: any) {
          throw new ApolloError(e)
        }
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
