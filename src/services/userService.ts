import { newUserSchema, ValidationError } from '../utils/parsers'
import bcrypt from 'bcrypt'
import prisma from '../prisma/db'
import { CustomError } from './commentService'

const passwordToHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const createOne = async (data: unknown) => {
  const newUser = newUserSchema.safeParse(data)
  if (!newUser.success) {
    const errorMessages = newUser.error.errors.map((err) => err.message)
    throw new ValidationError(errorMessages)
  }
  const password = await passwordToHash(newUser.data.password)
  const savedUser = await prisma.user.create({
    data: {
      ...newUser.data,
      password
    },
    select: {
      id: true,
      username: true,
      email: true
    }
  })
  return savedUser
}

const getOne = async (username: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          _count: { select: { Comment: true } }
        }
      }
    }
  })
  return {
    ...user,
    posts: user?.posts.map(post => {
      const { _count, ...rest } = post
      return {
        ...rest,
        comments: _count.Comment
      }
    })
  }
}


const getPost = async (username:string, postId: number) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      user: {
        username
      }
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      _count: { select: { Comment: true } }
    }
  })
  if (!post) throw new CustomError('PostNotFoundError', `Post with id ${postId} not found for user ${username}`)
  const { _count, ...rest } = post
  return {
    ...rest,
    comments: _count.Comment
  }
}


const getComments = async (username: string, postId:number) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
      post: {
        user: {
          username: username
        }
      }
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } }
    }
  })

  if (comments.length === 0) throw new CustomError('CommentNotFoundError', `Comments for post with id ${postId} not found for user ${username}`)

  return comments.map(comment => {
    const { user, ...rest } = comment
    return {
      ...rest,
      username: user.username
    }})
}

const getComment = async (username: string, postId: number, commentId: number) => {
  const comment = await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
      postId: postId,
      post: {
        user: {
          username: username
        }
      }
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } }
    }
  })

  if (!comment) throw new CustomError('CommentNotFoundError', `Comment with id ${commentId} not found for post with id ${postId} and user ${username}`)

  // const { user, ...rest } = comment
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    username: comment.user.username
  }
}

const deleteOne = async (username: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { username }, select: { id: true } })
  await prisma.user.delete({
    where: { id: user.id }
  })
}


export default { createOne, deleteOne, getOne, getPost, getComments, getComment }
