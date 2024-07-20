import { RequestHandler } from 'express'
import commentService from '../services/commentService'
import { CustomRequest, User } from '../utils/middleware'

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

export const deleteAllComments: RequestHandler = async (request: CustomRequest, response) => {
  const { id } = request.params
  const { username } = request.user as User
  await commentService.deleteAll(Number(id), username)
  response.status(204).end()
}

export const createComment: RequestHandler = async (request: CustomRequest, response) => {
  const { id } = request.params
  const { username } = request.user as User
  const comment = await commentService.createOne({
    ...request.body,
    postId: Number(id),
    username
  })
  response.status(201).json(comment)
}

export const updateComment: RequestHandler = async (request: CustomRequest, response) => {
  const { id, commentId } = request.params
  const { username } = request.user as User
  const comment = await commentService.updateOne({
    ...request.body,
    postId: Number(id),
    commentId: Number(commentId),
    username
  })
  response.json(comment)
}


export const deleteComment: RequestHandler = async (request: CustomRequest, response) => {
  const { id, commentId } = request.params
  const { username } = request.user as User
  await commentService.deleteOne(Number(id), Number(commentId), username)
  response.status(204).end()
}
