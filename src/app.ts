import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import middleware from './utils/middleware'
import postRouter from '@/routes/posts'

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// routes
app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.use('/api/posts',postRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


export default app