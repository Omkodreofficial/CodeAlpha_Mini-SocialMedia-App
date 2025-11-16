// server/routes/users.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyProfile,
  getUserProfile,
  updateAvatar,
  updateProfile,
  getSuggestions,
} from "../controllers/usersController.js";
import { upload } from "../utils/uploader.js";

const router = express.Router();

// Get your own profile
router.get("/me", requireAuth, getMyProfile);

// Get profile of another user
router.get("/:username", getUserProfile);

// Update avatar
router.patch("/me/avatar", requireAuth, upload.single("avatar"), updateAvatar);

// Update bio/name
router.patch("/me", requireAuth, updateProfile);

// Suggestions to follow
router.get("/", requireAuth, getSuggestions);

export default router;
