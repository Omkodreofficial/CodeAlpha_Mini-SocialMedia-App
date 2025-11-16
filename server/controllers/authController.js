// server/controllers/authController.js
import { getDb } from "../db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefresh,
} from "../utils/tokens.js";

function sendServerError(res, err) {
  console.error("AUTH ERROR:", err);
  return res.status(500).json({ error: "Server error" });
}

export async function registerUser(req, res) {
  try {
    const { name, username, password } = req.body;
    const db = await getDb();

    // check existing
    const exists = await db.get(`SELECT id FROM users WHERE username = ?`, [
      username,
    ]);
    if (exists)
      return res.status(400).json({ error: "Username already taken" });

    const hashed = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);

    const result = await db.run(
      `INSERT INTO users (name, username, password, avatar, bio, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, username, hashed, "", "", now]
    );

    const user = await db.get(
      `SELECT id, name, username, avatar, bio, created_at FROM users WHERE id = ?`,
      [result.lastID]
    );

    const token = createAccessToken(user.id);
    const refresh = createRefreshToken(user.id);

    return res.json({ token, refresh, user });
  } catch (err) {
    return sendServerError(res, err);
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const db = await getDb();

    const userRow = await db.get(
      `SELECT id, name, username, password, avatar, bio, created_at FROM users WHERE username = ?`,
      [username]
    );
    if (!userRow) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await comparePassword(password, userRow.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = createAccessToken(userRow.id);
    const refresh = createRefreshToken(userRow.id);

    const user = {
      id: userRow.id,
      name: userRow.name,
      username: userRow.username,
      avatar: userRow.avatar,
      bio: userRow.bio,
      created_at: userRow.created_at,
    };

    return res.json({ token, refresh, user });
  } catch (err) {
    return sendServerError(res, err);
  }
}

export async function refreshAccessToken(req, res) {
  try {
    const { refresh } = req.body;
    if (!refresh)
      return res.status(400).json({ error: "Refresh token required" });

    try {
      const decoded = verifyRefresh(refresh);
      const token = createAccessToken(decoded.userId);
      return res.json({ token });
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  } catch (err) {
    return sendServerError(res, err);
  }
}
