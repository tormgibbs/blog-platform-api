import {
  newCommentSchema,
  updateCommentSchema,
  ValidationError,
} from '../utils/parsers'
import prisma from '../prisma/db'

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

  return comments.map((comment:any) => ({
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

  const user = await prisma.user.findUniqueOrThrow({
    where: { username: newComment.data.username },
    select: { id: true }
  })

  const savedComment = await prisma.comment.create({
    data: {
      content: newComment.data.content,
      postId: newComment.data.postId,
      userId: user.id,
    }
  })
  return savedComment
}

export class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}

const deleteOne = async ( postId: number, commentId: number, user: string ) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId, postId },
    select: { user: { select: { username: true } } }
  })

  if (comment.user.username !== user) {
    throw new CustomError('AuthorizationError', 'User does not have the permission')
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
      postId: postId,
      user: { username: user }
    }
  })
}

const deleteAll = async (postId: number, user: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: { user: { select : { username: true } } }
  })

  if (post.user.username !== user) {
    throw new CustomError('AuthorizationError', 'User does not have the permission')
  }

  await prisma.comment.deleteMany({
    where: { postId, },
  })
}

const updateOne = async (data: unknown) => {
  const commentToUpdate = updateCommentSchema.safeParse(data)
  if (!commentToUpdate.success) {
    const errorMessages = commentToUpdate.error.errors.map((err) => err.message)
    throw new ValidationError(errorMessages)
  }

  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentToUpdate.data.commentId },
    select: { user: { select : { username: true } } }
  })

  if (comment.user.username !== commentToUpdate.data.username) {
    throw new CustomError('AuthorizationError', 'User does not have the permission')
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
