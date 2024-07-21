# Blog API Documentation

## Overview

This document provides comprehensive information about the Blog API endpoints, including posts, comments, users, and authentication.

**Live Demo:** [https://blog-platform-api-production.up.railway.app/](https://blog-platform-api-production.up.railway.app/)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yourproject.git
    ```

2. Navigate to the project directory:
    ```bash
    cd yourproject
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```


4. Create a `.env` file in the root directory and add the following variables:
    ```
    DATABASE_URL=your_database_url
    DIRECT_URL=your_database_url
    JWT_SECRET=your_secret_key
    PORT=your_port
    ```

5. Compile TypeScript to JavaScript:

    ```bash
    npm run build
    ```

6. Start the server:

    ```bash
    npm start
    ```

## Base URL

```
/api
```

## Authentication

Most endpoints require authentication. Include a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the login endpoint.

## API Endpoints

### Authentication

#### Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth required:** No
- **Request body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "username": "johndoe",
      "email": "user@example.com"
    }
    ```

### Users

#### Create a New User

- **URL:** `/users`
- **Method:** `POST`
- **Auth required:** No
- **Request body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
    ```

#### Get User Profile

- **URL:** `/users/:username`
- **Method:** `GET`
- **Auth required:** No
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "posts": [
        {
          "id": 1,
          "title": "My First Post",
          "content": "This is the content of my first post.",
          "createdAt": "2023-07-21T10:30:00Z",
          "comments": 5
        }
      ]
    }
    ```

#### Get User's Post

- **URL:** `/users/:username/:postId`
- **Method:** `GET`
- **Auth required:** No
- **URL Params:**
  - `username=[string]`
  - `postId=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "createdAt": "2023-07-21T10:30:00Z",
      "comments": 5
    }
    ```

#### Get User's Post Comments

- **URL:** `/users/:username/:postId/comments`
- **Method:** `GET`
- **Auth required:** No
- **URL Params:**
  - `username=[string]`
  - `postId=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    [
      {
        "id": 1,
        "content": "Great post!",
        "username": "janedoe",
        "createdAt": "2023-07-21T11:00:00Z"
      }
    ]
    ```

#### Get Specific Comment on User's Post

- **URL:** `/users/:username/:postId/comments/:commentId`
- **Method:** `GET`
- **Auth required:** No
- **URL Params:**
  - `username=[string]`
  - `postId=[integer]`
  - `commentId=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": 1,
      "content": "Great post!",
      "username": "janedoe",
      "createdAt": "2023-07-21T11:00:00Z"
    }
    ```

#### Delete User

- **URL:** `/users/:username`
- **Method:** `DELETE`
- **Auth required:** Yes (Own account only)
- **URL Params:** `username=[string]`
- **Success Response:**
  - **Code:** 204
  - **Content:** No content

### Posts

#### Get all Posts

- **URL:** `/posts`
- **METHOD:** `GET`
- **Auth required:** No
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    [
      {
        "id": 5,
        "title": "Healthy Living Tips",
        "content": "Some tips on how to live a healthy life.",
        "username": "janesmith123",
        "comments": 1,
        "createdAt": "2024-07-20T14:46:01.197Z"
      },
      {
        "id": 6,
        "title": "Fitness Journey",
        "content": "My journey to becoming fit and healthy.",
        "username": "janesmith123",
        "comments": 0,
        "createdAt": "2024-07-20T14:46:01.197Z"
      }
    ]
    ```

#### Get Post by ID

- **URL:** `/posts/:id`
- **METHOD:** `GET`
- **Auth required:** No
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": 5,
      "title": "Healthy Living Tips",
      "content": "Some tips on how to live a healthy life.",
      "username": "janesmith123",
      "comments": 1,
      "createdAt": "2024-07-20T14:46:01.197Z"
    }
    ```

#### Get Post's Comments

- **URL:** `/posts/:id/comments`
- **METHOD:** `GET`
- **Auth required:** No
- **URL Params:**
  - `id=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    [
      {
        "id": 1,
        "content": "Great post, Selase",
        "username": "slimbones05",
        "createdAt": "2024-07-20T14:46:03.932Z"
      },
      {
        "id": 2,
        "content": "Welcome to blogging",
        "username": "janesmith123",
        "createdAt": "2024-07-20T14:46:03.932Z"
      }
    ]
    ```

#### Get Specific Comment on Post

- **URL:** `/posts/:id/comments/:commentId`
- **METHOD:** `GET`
- **Auth required:** No
- **URL Params:**
  - `postId=[integer]`
  - `commentId=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": 2,
      "content": "Welcome to blogging",
      "username": "janesmith123",
      "createdAt": "2024-07-20T14:46:03.932Z"
    }
    ```
   

## Error Handling

This API uses conventional HTTP response codes to indicate the success or failure of an API request. Errors are returned in JSON format:

```json
{
  "error": "Error message here"
}
```

Common error codes:

- 400 Bad Request: Invalid input or validation error
- 401 Unauthorized: Authentication failed
- 403 Forbidden: The authenticated user doesn't have the required permissions
- 404 Not Found: The requested resource doesn't exist
- 500 Internal Server Error: Something went wrong on the server

## Validation

This API uses Zod for request validation. Common validation rules include:

- `username`: String, minimum 3 characters
- `email`: Valid email format
- `password`: String, minimum 6 characters
- `title`: String, minimum 5 characters
- `content`: String, minimum 5 characters

## Data Models

### User

```prisma
model User {
  id       Int       @id @default(autoincrement())
  username String    @unique
  password String
  email    String    @unique
  posts    Post[]
  comments Comment[]
}
```

### Post

```prisma
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  userId    Int
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  Comment   Comment[]
}
```

### Comment

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  userId    Int
  postId    Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```
