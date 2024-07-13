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

const router = Router()

router.get('/', getAllPosts)
router.post('/', createPost)
router.get('/:id', getPostById)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

router.get('/:id/comments', getAllComments)
router.post('/:id/comments', createComment)
router.delete('/:id/comments', deleteAllComments)
router.get('/:id/comments/:commentId', getCommentById)
router.put('/:id/comments/:commentId', updateComment)
router.delete('/:id/comments/:commentId', deleteComment)

export default router
