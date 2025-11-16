// server/controllers/followsController.js
import { getDb } from "../db.js";

export async function followUser(req, res) {
  const { id } = req.params;
  const db = await getDb();

  await db.run(
    `
    INSERT INTO follows (follower_id, followee_id)
    VALUES (?, ?)`,
    [req.userId, id]
  );

  res.json({ following: true });
}

export async function unfollowUser(req, res) {
  const { id } = req.params;
  const db = await getDb();

  await db.run(
    `
    DELETE FROM follows
    WHERE follower_id=? AND followee_id=?`,
    [req.userId, id]
  );

  res.json({ following: false });
}
