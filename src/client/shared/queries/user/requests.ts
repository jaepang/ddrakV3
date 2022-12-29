import { NexusGenArgTypes, NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import { USER_QUERY, UPDATE_USER_MUTATION } from './tags'

export const userQuery = async ({ queryKey }): Promise<{ user: NexusGenObjects['User'] }> => {
  const [_, variables] = queryKey
  return await graphQLClient.request(USER_QUERY, variables)
}

export const updateUserMutation = async (variables): Promise<{ updateUser: NexusGenObjects['User'] }> => {
  return await graphQLClient.request(UPDATE_USER_MUTATION, variables)
}
