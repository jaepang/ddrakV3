import gql from 'graphql-tag'
import { USER_FRAGMENT } from '@client/shared/queries'

export const UPDATE_USER_MUTATION = gql`
  mutation ($id: Int!, $email: String, $name: String, $profileImg: String, $school: String, $desc: String, $password: String) {
    updateUser(id: $id, email: $email, name: $name, profileImg: $profileImg, school: $school, desc: $desc, password: $password) {
      ${USER_FRAGMENT}
    }
  }
`
