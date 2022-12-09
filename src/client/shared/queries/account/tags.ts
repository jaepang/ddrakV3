import gql from 'graphql-tag'
import { USER_FRAGMENT } from '@client/shared/queries'

export const ME_QUERY = gql`
  query me {
    me {
      ${USER_FRAGMENT}
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
      user {
        ${USER_FRAGMENT}
      }
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        ${USER_FRAGMENT}
      }
    }
  }
`

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ($id: Int!, $password: String!, $newPassword: String!) {
    changePassword(id: $id, password: $password, newPassword: $newPassword) {
      token,
      user {
        ${USER_FRAGMENT}
      }
    }
  }
`
