import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  TOKEN_EXPIRY,
  REFRESH_SECRET,
  REFRESH_EXPIRY,
} from "../config.js";

export function createAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function createRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
