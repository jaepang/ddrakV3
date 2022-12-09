import { NexusGenArgTypes, NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import { CLUBS_QUERY } from './tags'

export const clubsQuery = async (): Promise<{ clubs: NexusGenObjects['Club'][] }> => {
  return await graphQLClient.request(CLUBS_QUERY)
}
