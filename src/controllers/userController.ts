import userService from '@/services/userService'
import { RequestHandler } from 'express'

export const createUser: RequestHandler = async (request, response) => {
  const { username, email, password } = request.body
  const user = await userService.createOne({ username, email, password })
  response.status(201).json(user)
}


export const deleteUser: RequestHandler = async (request, response) => {
  const { id } = request.params
  await userService.deleteOne(Number(id))
  response.status(204).end()
}

export const getUser: RequestHandler = async (request, response) => {
  const { username } = request.params
  const user = await userService.getOne(username)
  response.json(user)
}

export const getUserPost: RequestHandler = async (request, response) => {
  const { username, postId } = request.params
  const post = await userService.getPost(username, Number(postId))
  response.json(post)
}

export const getPostComments: RequestHandler = async (request, respose) => {
  const { username, postId } = request.params
  console.log('username', username)
  console.log('postID', postId)
  const comments = await userService.getComments(username, Number(postId))
  respose.json(comments)
}

export const getPostComment: RequestHandler = async (request, response) => {
  const { username, postId, commentId } = request.params
  const comment = await userService.getComment(username, Number(postId), Number(commentId))
  response.json(comment)
}

// export const getComments: RequestHandler = async (request, response) => {
//   const { username } = request.params
//   const comments = await userService.getComments(username)
//   response.json(comments)
// }