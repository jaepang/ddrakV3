import { verify, sign } from 'jsonwebtoken'
import { Context, Token, EXPIRATION_TIME } from './types'

const APP_SECRET = process.env.APP_SECRET

export function getUserId(context: Context): number {
  const authHeader = context?.req?.headers?.authorization
  if (!authHeader) return

  const token = authHeader.replace('Bearer ', '')
  const verifiedToken = verify(token, APP_SECRET) as Token
  return verifiedToken.userId
}

export function generateToken(tokenPayload: Token): string {
  return sign(tokenPayload, APP_SECRET, {
    expiresIn: EXPIRATION_TIME.USER_ACCESS_TOKEN,
  })
}
