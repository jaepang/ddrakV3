import { NexusGenArgTypes, NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import { UPDATE_USER_MUTATION } from './tags'

export const updateUserMutation = async (variables): Promise<{ updateUser: NexusGenObjects['User'] }> => {
  return await graphQLClient.request(UPDATE_USER_MUTATION, variables)
}
