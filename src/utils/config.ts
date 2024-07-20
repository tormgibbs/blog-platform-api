import dotenv from 'dotenv'
import { base64url } from 'jose'

dotenv.config()

const PORT = process.env.PORT
const secret = base64url.decode(new TextEncoder().encode(process.env.JWT_SECRET))

export default {
  PORT, secret
}