import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import logger from './logger'
import { ValidationError } from './parsers'
import { Prisma } from '@prisma/client'
import { CustomError } from '@/services/commentService'

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  // Listen for the finish event on the response to log the status code
  response.on('finish', () => {
    logger.info('Response Status:', response.statusCode)
    logger.info('---')
  })
  logger.info('---')
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  logger.error(error)
  logger.error('Error Message: ',error.message)
  logger.error('Error Name: ',error.name)


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
      }
    }
  } if (error instanceof CustomError) {
    return response.status(404).json({ error: error.message })
  }

  next(error)
  return
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
