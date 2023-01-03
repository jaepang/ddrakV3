import { NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import { CLUB_QUERY, CLUBS_QUERY } from './tags'

export const clubQuery = async ({ queryKey }): Promise<{ club: NexusGenObjects['Club'] }> => {
  const [, variables] = queryKey
  return await graphQLClient.request(CLUB_QUERY, variables)
}

export const clubsQuery = async (): Promise<{ clubs: NexusGenObjects['Club'][] }> => {
  return await graphQLClient.request(CLUBS_QUERY)
}
