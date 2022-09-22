/**
 * Posts routes.
 */

import express from "express";

const router = express.Router();

import {
  getPosts,
  addPost,
  getPost,
  deletePost,
  increasePostViewCount,
  togglePostPublishedState,
} from "#src/controllers/postsController";

router.get("/", getPosts);
router.post("/", addPost);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
router.put("/:id/views", increasePostViewCount);
router.put("/:id/publish", togglePostPublishedState);

export default router;
