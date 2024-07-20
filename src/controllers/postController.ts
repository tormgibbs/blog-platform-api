import postService from '@/services/postService'
import { CustomRequest, User } from '@/utils/middleware'
import { Request, RequestHandler, Response } from 'express'

export const getAllPosts = async (_request: Request, response: Response) => {
  const posts = await postService.getAll()
  response.json(posts)
}

export const getPostById = async (request: Request, response: Response) => {
  const { id } = request.params
  const post = await postService.getOne(Number(id))
  response.json(post)
}

export const createPost = async (request: Request, response: Response) => {
  const { title, content, userId } = request.body
  const post = await postService.createOne({ title, content, userId })
  response.status(201).json(post)
}

export const deletePost: RequestHandler = async (request: CustomRequest, response: Response) => {
  const { id } = request.params
  const { username } = request.user as User
  await postService.deleteOne(Number(id), username)
  response.status(204).end()
}

export const updatePost: RequestHandler = async (request, response) => {
  const { id } = request.params
  const post = await postService.updateOne({ ...request.body, postId: Number(id) })
  response.json(post)
}

// export const getAllComments