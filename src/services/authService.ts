import { loginSchema, ValidationError } from '../utils/parsers'
import prisma from '../prisma/db'
import bcrypt from 'bcrypt'
import { EncryptJWT } from 'jose'
import { CustomError } from './commentService'
import config from '../utils/config'

const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

const createToken = async (user: { username: string, email: string }) => {
  const jwt = await new EncryptJWT(user)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .encrypt(config.secret)

  return jwt
}

const authenticate = async (data: unknown) => {
  const loginData = loginSchema.safeParse(data)
  if (!loginData.success) {
    const errorMessages = loginData.error.errors.map(err => err.message)
    throw new ValidationError(errorMessages)
  }

  const user = await prisma.user.findUnique({
    where: { email: loginData.data.email }
  })



  if (!user) throw new CustomError('UserNotFoundError', 'User not found')

  const authenticatedUser = await verifyPassword(loginData.data.password, user.password)
  if (!authenticatedUser) throw new CustomError('AuthenticationError', 'Invalid credentials')

  const userForToken = {
    username: user.username,
    email: user.email
  }

  const token = await createToken(userForToken)

  return { token }

}

export default {
  authenticate
}
