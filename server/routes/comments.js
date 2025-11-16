// server/routes/comments.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listComments,
  createComment,
} from "../controllers/commentsController.js";

const router = express.Router();

router.get("/:postId", listComments);
router.post("/:postId", requireAuth, createComment);

export default router;
