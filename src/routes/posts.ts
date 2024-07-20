import {
  createComment,
  deleteAllComments,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from '@/controllers/commentController'
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '@/controllers/postController'
import { Router } from 'express'
import middleware from '@/utils/middleware'
const { validateParams, isPositiveInteger, tokenExtractor, userExtractor } = middleware

const router = Router()

router.get('/', getAllPosts)

router.post('/', [tokenExtractor, userExtractor] , createPost)

router.get('/:id', validateParams({ id: isPositiveInteger }), getPostById)

router.put('/:id', [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor], updatePost)

router.delete('/:id', [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor], deletePost)

router.get(
  '/:id/comments',
  validateParams({ id: isPositiveInteger }),
  getAllComments
)

router.post(
  '/:id/comments',
  [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor],
  createComment
)

router.delete(
  '/:id/comments',
  [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor],
  deleteAllComments
)


router.get(
  '/:id/comments/:commentId',
  validateParams({
    id: isPositiveInteger,
    commentId: isPositiveInteger,
  }),
  getCommentById
)


router.put(
  '/:id/comments/:commentId',
  [validateParams({
    id: isPositiveInteger,
    commentId: isPositiveInteger,
  }), tokenExtractor, userExtractor],
  updateComment
)


router.delete(
  '/:id/comments/:commentId',
  [
    validateParams({
      id: isPositiveInteger,
      commentId: isPositiveInteger,
    }),
    tokenExtractor,
    userExtractor,
  ],
  deleteComment
)

export default router
