import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express'
import logger from './logger'
import { ValidationError } from './parsers'
import { Prisma } from '@prisma/client'
import { CustomError } from '@/services/commentService'
import { jwtDecrypt } from 'jose'
import config from './config'

export interface User {
  username: string
  email: string
  iat: number
  iss: string
  aud: string
  exp: number
}

export interface CustomRequest extends Request {
  token?: string | Uint8Array
  user?: User
}


type ValidationFunction = (value: string) => boolean

// Define an interface for the validations object
type Validations = Record<string, ValidationFunction>

// export class AuthorizationError extends Error {
//   constructor(message = 'Authorization failed') {
//     super(message)
//     this.name = 'AuthorizationError'
//   }
// }

export class AuthorizationError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 403) {
    super(message)
    this.name = 'AuthorizationError'
    this.statusCode = statusCode
  }
}

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  // Listen for the finish event on the response to log the status code
  response.on('finish', () => {
    logger.info('Response Status:', response.statusCode)
    logger.info('---')
  })
  logger.info('---')
  next()
}

const validateParams = (validations: Validations): RequestHandler => (request, response, next) => {
  for (const [param, validation] of Object.entries(validations)) {
    const value = request.params[param]
    if (!validation(value)) {
      return response.status(400).json({ error: `Invalid ${param}` })
    }
  }
  return next()
}

const isPositiveInteger = (id: string) => Number.isInteger(Number(id)) && Number(id) > 0

const tokenExtractor: RequestHandler = (request: CustomRequest, _response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor: RequestHandler = async (request: CustomRequest, response, next) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'Authentication credentials were not provided' })
  }
  const { payload } = await jwtDecrypt(token, config.secret, {
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience'
  })
  request.user = payload as unknown as User
  next()
  return
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {

  if (error.name === 'ValidationError') {
    if (error instanceof ValidationError) {
      return response.status(400).json({ error: error.errors })
    }
  } else if (error.name === 'NotFoundError') {
    return response.status(404).json({ error: error.message })
  } else if (error.name === 'PrismaClientKnownRequestError') {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return response.status(404).json({ error: error.meta!.cause })
      } else if (error.code === 'P2002') {
        const target = error.meta?.target as string[]
        return response.status(409).json({
          error: `The ${target.join(', ')} field(s) already exists`
        })
      }
    }
  } if (error instanceof CustomError) {
    if (error.name === 'AuthenticationError') {
      return response.status(401).json({ error: error.message })
    } else if (error.name === 'AuthorizationError') {
      return response.status(403).json({ error: error.message })
    }
    return response.status(404).json({ error: error.message })
  } else if (error.name === 'JWTExpired') {
    return response.status(401).json({ error: 'Token expired' })
  }

  next(error)
  return
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  validateParams,
  isPositiveInteger,
  tokenExtractor,
  userExtractor
}
