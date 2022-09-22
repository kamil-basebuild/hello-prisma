# Prisma REST API Example

This example shows how to implement a **REST API with TypeScript** using [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client).

## Getting started

### 1. Install dependencies

```
npm install
```

### 2. Create and seed the database

First, run a PostgreSQL database server locally and set the `DATABASE_URL` variable in the `.env` file to point to your database.

Then run the command below to set up the `User`, `Post` and `Profile` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. Make an API request, e.g. [`http://localhost:3000/feed`](http://localhost:3000/feed) to test everything works as expected.

## Using the REST API

You can access the REST API of the server using the following endpoints:

### Users `/users`

- `GET /`: Get all users
- `POST /`: Add user
  - Body:
    - `name: String` (optional): The name of the user
    - `email: String` (required): The email address of the user
    - `posts: PostCreateInput[]` (optional): The posts of the user
    - `profile: ProfileCreateInput` (optional): The user profile
- `GET /:id`: Get user with id `id`
- `GET /:id/drafts`: Get drafts for user with id `id`

### Posts `/posts`

- `GET /`: Get all posts
  - Query Parameters
    - `searchString?: String`: This filters posts by `title` or `content`
    - `published?: Boolean`: This filters posts by their `published` value (`true` for published, `false` for drafts)
    - `take?: Number`: This specifies how many objects should be returned in the list
    - `skip?: Number`: This specifies how many of the returned objects in the list should be skipped
    - `orderBy?: String`: The sort order for posts in either ascending or descending order. The value can either `asc` or `desc`
- `POST /`: Add post
  - Body:
    - `title: String`: The title of the post
    - `content?: String`: The content of the post
    - `authorEmail: String`: The email of the user that creates the post
- `GET /:id`: Get post with id `id`
- `DELETE /:id`: Delete post with id `id`
- `PUT /:id/views`: Increase view count of post with id `id` by 1
- `PUT /:id/publish`: Toggle `published` state of post with id `id`
