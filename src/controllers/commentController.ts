import { RequestHandler } from 'express'
import commentService from '@/services/commentService'

export const getAllComments: RequestHandler = async (request, response) => {
  const { id } = request.params
  const comments = await commentService.getAll(Number(id))
  response.json(comments)
}


export const getCommentById: RequestHandler = async (request, response) => {
  const { id, commentId } = request.params
  const comment = await commentService.getOne(Number(id), Number(commentId))
  response.json(comment)
}

export const deleteAllComments: RequestHandler = async (request, response) => {
  const { id } = request.params
  await commentService.deleteAll(Number(id))
  response.status(204).end()
}

export const createComment: RequestHandler = async (request, response) => {
  const { id } = request.params
  const comment = await commentService.createOne({
    ...request.body,
    postId: Number(id)
  })
  response.status(201).json(comment)
}

export const updateComment: RequestHandler = async (request, response) => {
  const { id, commentId } = request.params
  const comment = await commentService.updateOne({
    ...request.body,
    postId: Number(id),
    commentId: Number(commentId)
  })
  response.json(comment)
}


export const deleteComment: RequestHandler = async (request, response) => {
  const { id, commentId } = request.params
  await commentService.deleteOne(Number(id), Number(commentId))
  response.status(204).end()
}
