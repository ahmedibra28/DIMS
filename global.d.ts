import { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from './models/User'
import { NextRequest } from 'next/server'
import { PrismaClient } from './prisma/generated/client'

type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: string
  instructorId?: string
  studentId?: string
  mobile?: number
}

type RequestQuery = {
  limit: string
  page: string
  q: string
  id: string
  secret: string
  type: string
  option: string
}

declare module 'next/server' {
  interface NextRequest {
    user: AuthenticatedUser
    query: RequestQuery
  }
}

declare global {
  var mongoose: any
  var prisma: PrismaClient | undefined
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      MONGO_URI: string
      JWT_SECRET: string
      SMTP_SERVER: string
      SMTP_PORT: number
      SMTP_USER: string
      SMTP_KEY: string
    }
  }
  interface NextApiRequestExtended extends Request {
    user: AuthenticatedUser
    url: string
    method: string
    query: RequestQuery
  }
  interface NextApiResponseExtended extends NextRequest {
    Data: any
  }
}
