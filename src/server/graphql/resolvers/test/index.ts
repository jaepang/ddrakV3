import { extendType } from 'nexus'
import { ApolloError } from 'apollo-server-micro'

enum TEST_ERROR_CODE {
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}

export const TestQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('testQuery', {
      type: 'String',
      resolve: async (_, __, ___) => {
        return 'test query was successful.'
      },
    })

    t.field('testUserAuthenticationQuery', {
      type: 'String',
      resolve: async (_, __, ___) => {
        return 'test query was successful.'
      },
    })

    t.field('testErrorQuery', {
      type: 'String',
      resolve: async (_, __, ___) => {
        throw new ApolloError('test error query was successful.', TEST_ERROR_CODE.INVALID_REQUEST, {
          args: {
            email: 'abcd@edfg.com',
          },
        })
      },
    })
  },
})
