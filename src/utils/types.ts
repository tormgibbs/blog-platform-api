
export interface User {
  id: number
  name: string
  email: string
  posts: Post[]
  comments: Comment[]
}

export interface Post {
  id: number
  title: string
  content: string
  userId: number
  createdAt: Date
  user: User
  comments: Comment[]
}

export interface Comment {
  id: number
  content: string
  postId: number
  createdAt: Date
  post: Post
}

export type NewPost = Omit<Post, 'id'>
