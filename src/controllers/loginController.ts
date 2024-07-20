import auth from '@/services/authService'
import { RequestHandler } from 'express'

export const authenticateUser: RequestHandler = async (request, response) => {
  const body = request.body
  const user = await auth.authenticate(body)
  response.json(user)
}


