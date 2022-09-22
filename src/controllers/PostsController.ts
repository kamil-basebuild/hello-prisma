/**
 * Controller for posts routes.
 */

import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import prisma from "#src/config/prisma";

const ERROR_NOT_FOUND = (id: string) =>
  `Post with id ${id} does not exist in the database.`;

// Get all posts (/)
export const getPosts = async (req: Request, res: Response) => {
  const { searchString, published, skip, take, orderBy } = req.query;

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
      published: Boolean(published),
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
};

// Add post (/)
export const addPost = async (req: Request, res: Response) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    },
  });

  res.json(result);
};

// Get post with id `id` (/:id)
export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(post);
};

// Delete post with id `id` (/:id)
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  res.json(post);
};

// Increase view count of post with id `id` (/:id/views)
export const increasePostViewCount = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json({ error: ERROR_NOT_FOUND(id) });
  }
};

// Toggle published state of post with id `id` (/:id/publish)
export const togglePostPublishedState = async (req: Request, res: Response) => {
  const { id } = req.params;

  let published;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        published: true,
      },
    });
    if (post) published = post.published;
  } catch (error) {
    res.status(404).json({ error: ERROR_NOT_FOUND(id) });
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      published: !published,
    },
  });

  res.json(updatedPost);
};
