import { authenticateUser } from '../controllers/loginController'
import { Router } from 'express'

const router = Router()


router.post('/login', authenticateUser)

export default router
