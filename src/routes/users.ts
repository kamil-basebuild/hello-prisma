/**
 * Users routes.
 */

import express from "express";

import {
  getUsers,
  getUser,
  getUserDrafts,
  addUser,
} from "#src/controllers/UsersController";

const router = express.Router();

// Users-specific middleware
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUser);
router.get("/:id/drafts", getUserDrafts);

export default router;
