import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export enum AUTH_STATUS {
  AUTHENTICATED = 'AUTHENTICATED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}

export interface Context {
  req: Request
  res: Response
  userId: number
  authStatus: AUTH_STATUS
  prisma: PrismaClient
  session: any
  pubsub: any
}

export interface Token {
  userId: number
}

export const enum EXPIRATION_TIME {
  USER_ACCESS_TOKEN = '24h',
  ADMIN_ACCESS_TOKEN = '6h',
}
