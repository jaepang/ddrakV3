import { rule } from 'graphql-shield'
import { AUTH_STATUS, Context } from '@server/apollo/types'
import { ERROR_CODES } from '@root/src/shared/types'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, ctx: Context, _info) => {
    switch (ctx.authStatus) {
      case AUTH_STATUS.AUTHENTICATED:
        return true
      case AUTH_STATUS.TOKEN_EXPIRED:
        return new Error(ERROR_CODES.AUTH_TOKEN_EXPIRED)
      case AUTH_STATUS.TOKEN_INVALID:
        return new Error(ERROR_CODES.AUTH_TOKEN_INVALID)
      default:
        return new Error(ERROR_CODES.AUTH_TOKEN_NOT_FOUND)
    }
  }),
}

export default rules
