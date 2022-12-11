import { NexusGenArgTypes, NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import { ME_QUERY, LOGIN_MUTATION, SIGNUP_MUTATION, CHANGE_PASSWORD_MUTATION } from './tags'

export const meQuery = async (): Promise<{ me: NexusGenObjects['User'] }> => {
  return await graphQLClient.request(ME_QUERY)
}

export const loginMutation = async (
  variables: NexusGenArgTypes['Mutation']['login'],
): Promise<{ login: NexusGenObjects['AuthPayload'] }> => {
  return await graphQLClient.request(LOGIN_MUTATION, variables)
}

export const signupMutation = async (
  variables: NexusGenArgTypes['Mutation']['signup'],
): Promise<{ signup: NexusGenObjects['AuthPayload'] }> => {
  return await graphQLClient.request(SIGNUP_MUTATION, variables)
}

export const changePasswordMutation = async (
  variables: NexusGenArgTypes['Mutation']['changePassword'],
): Promise<{ changePassword: NexusGenObjects['AuthPayload'] }> => {
  return await graphQLClient.request(CHANGE_PASSWORD_MUTATION, variables)
}
