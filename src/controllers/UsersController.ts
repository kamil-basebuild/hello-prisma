/**
 * Controller for users routes.
 */

import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import prisma from "#src/config/prisma";

// Get all users (/)
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });

  res.json(users);
};

// Add user (/)
export const addUser = async (req: Request, res: Response) => {
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
};

// Get user with id `id` (/:id)
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      posts: true,
      profile: true,
    },
  });

  res.json(user);
};

// Get drafts for user with id `id` (:/id/drafts)
export const getUserDrafts = async (req: Request, res: Response) => {
  const { id } = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: {
        published: false,
      },
    });

  res.json(drafts);
};
