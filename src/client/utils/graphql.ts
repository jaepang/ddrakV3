import { GraphQLClient } from 'graphql-request'
import { PATHNAME } from '@root/src/client/consts'
import { getAuthTokenFromLocalStorage } from './authentication'

export const graphQLClient = new GraphQLClient(PATHNAME.GRAPHQL, {
  headers: {
    authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
  },
})
