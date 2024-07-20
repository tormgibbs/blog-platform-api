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

router.post('/', createPost)

router.get('/:id', validateParams({ id: isPositiveInteger }), getPostById)

router.put('/:id', validateParams({ id: isPositiveInteger }), updatePost)

router.delete('/:id', [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor], deletePost)

router.get(
  '/:id/comments',
  [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor],
  getAllComments
)

router.post(
  '/:id/comments',
  [validateParams({ id: isPositiveInteger }), tokenExtractor, userExtractor],
  createComment
)

router.delete(
  '/:id/comments',
  validateParams({ id: isPositiveInteger }),
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
  validateParams({
    id: isPositiveInteger,
    commentId: isPositiveInteger,
  }),
  updateComment
)


router.delete(
  '/:id/comments/:commentId',
  validateParams({
    id: isPositiveInteger,
    commentId: isPositiveInteger,
  }),
  deleteComment
)

export default router
