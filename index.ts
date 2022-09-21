import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

/**
 * Users
 */
// Get users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });

  res.json(users);
});

// Add user
app.post(`/users`, async (req, res) => {
  const { name, email, posts, profile } = req.body;

  const postData = posts?.map((post: Prisma.PostCreateInput) => ({
    title: post.title,
    content: post.content,
    published: post.published,
  }));

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
      profile: {
        create: profile,
      },
    },
  });

  res.json(result);
});

// Get user with id `id`
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: +id,
    },
    include: {
      posts: true,
      profile: true,
    },
  });

  res.json(user);
});

// Get drafts for user with id `id`
app.get("/user/:id/drafts", async (req, res) => {
  const { id } = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: +id,
      },
    })
    .posts({
      where: {
        published: false,
      },
    });

  res.json(drafts);
});

/**
 * Posts
 */
// Get post with id `id`
app.get(`/posts/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: +id },
  });

  res.json(post);
});

// Add post
app.post(`/posts`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  });

  res.json(result);
});

// Increase view count of post with id `id`
app.put("/posts/:id/views", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: {
        id: +id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.json({ error: `Post with id ${id} does not exist in the database.` });
  }
});

// Toggle published state of post with id `id`
app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;

  let published;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: +id,
      },
      select: {
        published: true,
      },
    });
    if (post) published = post.published;
  } catch (error) {
    res.json({ error: `Post with id ${id} does not exist in the database.` });
  }

  const updatedPost = await prisma.post.update({
    where: { id: +id },
    data: { published: !published },
  });

  res.json(updatedPost);
});

// Delete post with id `id`
app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: +id,
    },
  });

  res.json(post);
});

// Fetch all published posts
app.get("/feed", async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: {
      author: true,
    },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });

  res.json(posts);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
