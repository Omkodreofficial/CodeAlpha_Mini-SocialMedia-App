// server/routes/auth.js
import express from "express";
import Joi from "joi";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimit.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/authController.js";

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// POST /api/v1/auth/register
router.post("/register", authLimiter, validate(registerSchema), registerUser);

// POST /api/v1/auth/login
router.post("/login", authLimiter, validate(loginSchema), loginUser);

// POST /api/v1/auth/refresh
router.post("/refresh", refreshAccessToken);

export default router;
