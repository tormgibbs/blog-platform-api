import {
  createUser,
  deleteUser,
  getPostComment,
  getPostComments,
  getUser,
  getUserPost,
} from '@/controllers/userController'
import middleware from '@/utils/middleware'
import { Router } from 'express'

const router = Router()

router.post('/', createUser)
router.delete('/', deleteUser)

router.get('/:username', getUser)
router.get(
  '/:username/:postId',
  middleware.validateParams({ postId: middleware.isPositiveInteger }),
  getUserPost
)
router.get(
  '/:username/:postId/comments',
  middleware.validateParams({ postId: middleware.isPositiveInteger }),
  getPostComments
)
router.get(
  '/:username/:postId/comments/:commentId',
  middleware.validateParams({
    postId: middleware.isPositiveInteger,
    commentId: middleware.isPositiveInteger,
  }),
  getPostComment
)

export default router
