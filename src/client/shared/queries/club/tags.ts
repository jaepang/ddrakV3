import gql from 'graphql-tag'
import { CLUB_FRAGMENT } from '@client/shared/queries'

export const CLUB_QUERY = gql`
  query ClubQuery($id: Int!) {
    club(id: $id) {
      ${CLUB_FRAGMENT}
    }
  }
`

export const CLUBS_QUERY = gql`
  query ClubQuery {
    clubs {
      ${CLUB_FRAGMENT}
    }
  }
`
