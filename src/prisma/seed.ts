import prisma from './db'
import bcrypt from 'bcrypt'

const passwordToHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const main = async () => {
  // User 1: Selase
  const selasePassword = await passwordToHash('selase123')

  const selase = await prisma.user.upsert({
    where: { email: 'emmasela04@gmail.com' },
    update: {},
    create: {
      username: 'tormgibbs',
      email: 'emmasela04@gmail.com',
      password: selasePassword,
      posts: {
        create: {
          title: 'My first blog. hahha',
          content: 'This is my first blog post. I hope you like it.'
        }
      }
    }
  })

  // User 2: Sabina
  const sabinaPassword = await passwordToHash('sabina123')

  const sabina = await prisma.user.upsert({
    where: { email: 'blefonoSabina233@gmail.com' },
    update: {},
    create: {
      username: 'slimbones05',
      email: 'blefonoSabina233@gmail.com',
      password: sabinaPassword,
      posts: {
        create: {
          title: 'Why Give Up?',
          content: 'Life is a journey, and it\'s okay to give up sometimes.'
        }
      }
    }
  })

  // User 3: John Doe
  const johnPassword = await passwordToHash('john123')

  const john = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      username: 'johnnydoe',
      email: 'john.doe@example.com',
      password: johnPassword,
      posts: {
        create: [
          {
            title: 'John\'s Tech Insights',
            content: 'Here are some tech insights I want to share.'
          },
          {
            title: 'John\'s Travel Diary',
            content: 'This post is about my recent travels.'
          }
        ]
      }
    }
  })

  // User 4: Jane Smith
  const janePassword = await passwordToHash('jane123')

  const jane = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      username: 'janesmith123',
      email: 'jane.smith@example.com',
      password: janePassword,
      posts: {
        create: [
          {
            title: 'Healthy Living Tips',
            content: 'Some tips on how to live a healthy life.'
          },
          {
            title: 'Fitness Journey',
            content: 'My journey to becoming fit and healthy.'
          }
        ]
      }
    }
  })

  const comments = await prisma.comment.createMany({
    data: [
      {
        content: 'Great post, Selase',
        userId: 2,
        postId: 1
      },
      {
        content: 'Welcome to blogging',
        userId: 4,
        postId: 1
      },
      {
        content: 'Looking forward to more!',
        userId: 1,
        postId: 2
      },
      {
        content: 'Very informative, John!',
        userId: 2,
        postId: 3
      },
      {
        content: 'Awesome travel experiences!',
        userId: 3,
        postId: 5
      },
    ]
  })

  console.log({ selase, sabina, jane, john })
  console.log(comments)

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })