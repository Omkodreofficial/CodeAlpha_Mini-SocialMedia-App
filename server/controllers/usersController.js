// server/controllers/usersController.js
import { getDb } from "../db.js";
import { compressImage } from "../utils/uploader.js";

export async function getMyProfile(req, res) {
  const db = await getDb();
  const user = await db.get(
    `SELECT id, name, username, avatar, bio, created_at FROM users WHERE id=?`,
    [req.userId]
  );
  res.json(user);
}

export async function getUserProfile(req, res) {
  const { username } = req.params;
  const db = await getDb();

  const user = await db.get(
    `SELECT id, name, username, avatar, bio, created_at FROM users WHERE username=?`,
    [username]
  );
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
}

export async function updateAvatar(req, res) {
  if (!req.file) return res.status(400).json({ error: "missing file" });

  const path = await compressImage(req.file.path);

  const url = `/uploads/${path.split("uploads/")[1]}`;

  const db = await getDb();
  await db.run(`UPDATE users SET avatar=? WHERE id=?`, [url, req.userId]);

  const updated = await db.get(
    `SELECT id, name, username, avatar FROM users WHERE id=?`,
    [req.userId]
  );
  res.json(updated);
}

export async function updateProfile(req, res) {
  const { name, bio } = req.body;

  const db = await getDb();
  await db.run(`UPDATE users SET name=?, bio=? WHERE id=?`, [
    name ?? "",
    bio ?? "",
    req.userId,
  ]);

  const updated = await db.get(
    `SELECT id, name, username, avatar, bio FROM users WHERE id=?`,
    [req.userId]
  );
  res.json(updated);
}

export async function getSuggestions(req, res) {
  const db = await getDb();

  const sql = `
    SELECT u.id, u.name, u.username, u.avatar,
      EXISTS(SELECT 1 FROM follows f WHERE f.follower_id=? AND f.followee_id=u.id) as following
    FROM users u
    WHERE u.id != ?
    ORDER BY u.created_at DESC
    LIMIT 8
  `;

  const rows = await db.all(sql, [req.userId, req.userId]);

  res.json(rows);
}
