import {
  newCommentSchema,
  updateCommentSchema,
  ValidationError,
} from '@/utils/parsers'
import prisma from 'prisma/db'

const getAll = async (postId: number) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    username: comment.user.username,
    createdAt: comment.createdAt,
  }))
}

const getOne = async (postId: number, commentId: number) => {
  const comment = await prisma.comment.findFirst({
    where: {
      AND: [{ id: commentId }, { postId }],
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
    },
  })

  if (!comment) {
    throw new CustomError('CommentNotFoundError', 'Comment not found or does not belong to the specified post')
  }

  return {
    id: comment?.id,
    content: comment?.content,
    username: comment?.user.username,
    createdAt: comment?.createdAt,
  }
}

const createOne = async (data: unknown) => {
  const newComment = newCommentSchema.safeParse(data)
  if (!newComment.success) {
    const errorMessages = newComment.error.errors.map((err) => err.message)
    throw new ValidationError(errorMessages)
  }
  const savedComment = await prisma.comment.create({
    data: newComment.data,
  })
  return savedComment
}

export class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}

const deleteOne = async ( postId: number, commentId: number ) => {
  const postToDelete = await prisma.comment.deleteMany({
    where: {
      AND: [
        { id: commentId },
        { postId }
      ]
    },
  })

  console.log(postToDelete.count)

  if (postToDelete.count === 0) {
    throw new CustomError('CommentNotFoundError', 'Comment not found or does not belong to the specified post')
  }
}

const deleteAll = async (postId: number) => {
  await prisma.comment.deleteMany({
    where: { postId },
  })
}

const updateOne = async (data: unknown) => {
  const commentToUpdate = updateCommentSchema.safeParse(data)
  if (!commentToUpdate.success) {
    const errorMessages = commentToUpdate.error.errors.map((err) => err.message)
    throw new ValidationError(errorMessages)
  }
  const updatedComment = await prisma.comment.update({
    where: { id: commentToUpdate.data.commentId },
    data: {
      content: commentToUpdate.data.content
    },
  })
  return updatedComment
}

export default { getAll, getOne, deleteAll, createOne, updateOne, deleteOne }
