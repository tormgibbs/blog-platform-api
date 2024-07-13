import { newpostSchema, updatePostSchema, ValidationError } from '@/utils/parsers'
import prisma from 'prisma/db'

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
  const savedPost = await prisma.post.create({
    data: newPost.data,
  })
  return savedPost
}

const deleteOne = async (id: number) => {
  await prisma.post.delete({
    where: { id }
  })
}

const updateOne = async (data: unknown) => {
  const postToUpdate = updatePostSchema.safeParse(data)
  console.log(postToUpdate.data)
  if (!postToUpdate.success) {
    const errorMessages = postToUpdate.error.errors.map(err => err.message)
    throw new ValidationError(errorMessages)
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
