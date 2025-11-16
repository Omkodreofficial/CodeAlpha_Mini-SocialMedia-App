// server/config.js
// Thin config wrapper: prefer environment variables (.env) but provide safe defaults for local dev.

const env = process.env;

export const JWT_SECRET =
  env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGE_THIS_IN_DEV";
export const REFRESH_SECRET =
  env.REFRESH_SECRET || "REFRESH_SECRET_KEY_CHANGE_THIS_IN_DEV";

// token expiry strings accepted by jsonwebtoken
export const TOKEN_EXPIRY = env.TOKEN_EXPIRY || "15m";
export const REFRESH_EXPIRY = env.REFRESH_EXPIRY || "7d";

// CORS whitelist — keep this in sync with your frontend dev origin(s)
export const CORS_WHITELIST = (env.CORS_WHITELIST &&
  env.CORS_WHITELIST.split(",")) || [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// DB file path (if used by other scripts)
export const DB_FILE = env.DB_FILE || "./data/social.db";

// Helpful: export port as well
export const PORT = env.PORT || 4000;
