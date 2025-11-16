// server/controllers/postsController.js
import { getDb } from "../db.js";
import { compressImage } from "../utils/uploader.js";

export async function createPost(req, res) {
  const { content } = req.body;
  let image_url = null;

  if (!content && !req.file)
    return res.status(400).json({ error: "Post must contain text or image" });

  if (req.file) {
    const path = await compressImage(req.file.path);
    image_url = `/uploads/${path.split("uploads/")[1]}`;
  }

  const db = await getDb();

  const now = Math.floor(Date.now() / 1000);
  await db.run(
    `
    INSERT INTO posts (user_id, content, image_url, created_at)
    VALUES (?, ?, ?, ?)`,
    [req.userId, content, image_url, now]
  );

  res.json({ success: true });
}

export async function getFeed(req, res) {
  const db = await getDb();

  const sql = `
    SELECT
      p.id,
      p.content,
      p.image_url,
      p.created_at,
      u.username,
      u.name,
      u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id=p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id=p.id) as comments_count,
      EXISTS(SELECT 1 FROM likes WHERE user_id=? AND post_id=p.id) as you_liked
    FROM posts p
    JOIN users u ON p.user_id=u.id
    ORDER BY p.created_at DESC
    LIMIT 50
  `;

  const rows = await db.all(sql, [req.userId]);

  res.json(rows);
}

export async function likePost(req, res) {
  const { id } = req.params;
  const db = await getDb();

  await db.run(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`, [
    req.userId,
    id,
  ]);

  const likes = await db.get(
    `SELECT COUNT(*) as count FROM likes WHERE post_id=?`,
    [id]
  );

  res.json({ liked: true, likes_count: likes.count });
}

export async function unlikePost(req, res) {
  const { id } = req.params;
  const db = await getDb();

  await db.run(`DELETE FROM likes WHERE user_id=? AND post_id=?`, [
    req.userId,
    id,
  ]);

  const likes = await db.get(
    `SELECT COUNT(*) as count FROM likes WHERE post_id=?`,
    [id]
  );

  res.json({ liked: false, likes_count: likes.count });
}
