import gql from 'graphql-tag'
import { CLUB_FRAGMENT } from '@client/shared/queries'

export const CLUBS_QUERY = gql`
  query ClubQuery {
    clubs {
      ${CLUB_FRAGMENT}
    }
  }
`
