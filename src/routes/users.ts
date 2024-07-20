import {
  createUser,
  deleteUser,
  getPostComment,
  getPostComments,
  getUser,
  getUserPost,
} from '../controllers/userController'
import middleware from '../utils/middleware'
import { Router } from 'express'

const { validateParams, isPositiveInteger, tokenExtractor, userExtractor } = middleware
const router = Router()

router.post('/', createUser)

router.delete('/:username', [tokenExtractor, userExtractor], deleteUser)

router.get('/:username', getUser)

router.get(
  '/:username/:postId',
  validateParams({ postId: isPositiveInteger }),
  getUserPost
)

router.get(
  '/:username/:postId/comments',
  validateParams({ postId: isPositiveInteger }),
  getPostComments
)

router.get(
  '/:username/:postId/comments/:commentId',
  validateParams({
    postId: isPositiveInteger,
    commentId: isPositiveInteger,
  }),
  getPostComment
)

export default router
