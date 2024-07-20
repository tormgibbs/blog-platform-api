import { newpostSchema, updatePostSchema, ValidationError } from '../utils/parsers'
import prisma from '../prisma/db'
import { CustomError } from './commentService'

const getAll = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
      _count: { select: { Comment: true } }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    username: post.user.username,
    comments: post._count.Comment,
    createdAt: post.createdAt
  }))
}

const getOne = async (id: number) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
      _count: { select: { Comment: true } }
    }
  })
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    username: post.user.username,
    comments: post._count.Comment,
    createdAt: post.createdAt
  }
}

const createOne = async (data: unknown) => {
  const newPost = newpostSchema.safeParse(data)
  if (!newPost.success) {
    const errorMessages = newPost.error.errors.map(err => err.message)
    throw new ValidationError(errorMessages)
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { username: newPost.data.username },
    select: { id: true }
  })

  const savedPost = await prisma.post.create({
    data: {
      title: newPost.data.title,
      content: newPost.data.content,
      userId: user.id,
    }
  })
  return savedPost
}

const deleteOne = async (id: number, user: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id },
    select: { user: { select: { username: true } } }
  })

  const postUser = post.user.username

  if (postUser !== user) {
    throw new CustomError('AuthorizationError', 'User does not have the permission',)
  }

  await prisma.post.delete({
    where: { id },
  })
}

const updateOne = async (data: unknown) => {
  const postToUpdate = updatePostSchema.safeParse(data)

  if (!postToUpdate.success) {
    const errorMessages = postToUpdate.error.errors.map(err => err.message)
    throw new ValidationError(errorMessages)
  }

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postToUpdate.data.postId },
    select: { user: { select: { username: true } } }
  })

  const postUser = post.user.username
  const user = postToUpdate.data.username

  if (postUser !== user) {
    throw new CustomError('AuthorizationError', 'User does not have the permission',)
  }

  const updatedPost = await prisma.post.update({
    where: { id: postToUpdate.data.postId },
    data: {
      title: postToUpdate.data.title,
      content: postToUpdate.data.content,
    },
  })
  return updatedPost
}

export default { getAll, getOne, createOne, deleteOne, updateOne }
