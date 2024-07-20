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

  // userId: z
  //   .number({
  //     required_error: 'User ID is required',
  //     invalid_type_error: 'User ID must be a number',
  //   })
  //   .int({ message: 'User ID must be an integer' }),

  username: z.string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
})

export const updatePostSchema = z.object({
  title: newpostSchema.shape.title.optional(),
  content: newpostSchema.shape.content.optional(),
  username: newpostSchema.shape.username,
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
  username: z.string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
})

export const updateCommentSchema = z.object({
  content: newCommentSchema.shape.content.optional(),
  username: newCommentSchema.shape.username,
  commentId: z
    .number({
      required_error: 'Comment ID is required',
      invalid_type_error: 'Comment ID must be a number',
    })
    .int({
      message: 'Comment ID must be an integer',
    }),
})


export const newUserSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(3, { message: 'Username must be at least 3 characters long' }),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Email is invalid' }),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export const loginSchema = z.object({
  email: newUserSchema.shape.email,
  password: newUserSchema.shape.password,
})

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}
