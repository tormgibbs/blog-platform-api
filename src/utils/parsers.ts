import { z } from 'zod'

export const newpostSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(5, { message: 'Title must be at least 5 characters long' }),

  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(5, { message: 'Content must be at least 20 characters long' }),

  userId: z
    .number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number',
    })
    .int({ message: 'User ID must be an integer' }),
})

export const updatePostSchema = z.object({
  title: newpostSchema.shape.title.optional(),
  content: newpostSchema.shape.content.optional(),
  userId: newpostSchema.shape.userId,
  postId: z
    .number({
      required_error: 'Post ID is required',
      invalid_type_error: 'Post ID must be a number',
    })
    .int({ message: 'Post ID must be an integer' }),
})

export const newCommentSchema = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(5, {
      message: 'Content must be at least 5 characters long',
    }),
  postId: z
    .number({
      required_error: 'Post ID is required',
      invalid_type_error: 'Post ID must be a number',
    })
    .int({
      message: 'Post ID must be an integer',
    }),
  userId: z
    .number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number',
    })
    .int({
      message: 'User ID must be an integer',
    }),
})

export const updateCommentSchema = z.object({
  content: newCommentSchema.shape.content.optional(),
  userId: newCommentSchema.shape.userId,
  commentId: z
    .number({
      required_error: 'Comment ID is required',
      invalid_type_error: 'Comment ID must be a number',
    })
    .int({
      message: 'Comment ID must be an integer',
    }),
})

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}
