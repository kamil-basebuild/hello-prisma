/**
 * Users routes.
 */

import express, { Request, Response, NextFunction } from "express";

import {
  getUsers,
  getUser,
  getUserDrafts,
  addUser,
} from "#src/controllers/usersController";

const router = express.Router();

// Users-specific middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUser);
router.get("/:id/drafts", getUserDrafts);

export default router;
