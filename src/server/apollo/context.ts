import { verify } from 'jsonwebtoken'
import { AUTH_STATUS, Token } from '@server/apollo/types'
import prisma from '@server/prisma'
import { Context } from '@server/apollo/types'

const APP_SECRET = process.env.APP_SECRET

export function createContext(ctx: Context): Context {
  let userId: number = 0
  let authStatus: AUTH_STATUS = AUTH_STATUS.UNKNOWN

  try {
    const Authorization = ctx.req.headers.authorization
    const token = Authorization.replace('Bearer ', '')

    const verifiedToken = verify(token, APP_SECRET) as Token

    if (verifiedToken.userId) {
      authStatus = AUTH_STATUS.AUTHENTICATED
      userId = verifiedToken.userId
    }
  } catch (err) {
    const { name } = err
    switch (name) {
      // 토큰 만료
      case 'TokenExpiredError':
        authStatus = AUTH_STATUS.TOKEN_EXPIRED
        break
      // 잘못된 토큰
      case 'JsonWebTokenError':
        authStatus = AUTH_STATUS.TOKEN_INVALID
        break
      default:
        authStatus = AUTH_STATUS.TOKEN_NOT_FOUND
        break
    }
  }

  return {
    ...ctx,
    userId,
    authStatus,
    prisma,
  }
}
