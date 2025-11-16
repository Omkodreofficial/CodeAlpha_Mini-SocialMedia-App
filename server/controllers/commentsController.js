// server/controllers/commentsController.js
import { getDb } from "../db.js";

export async function listComments(req, res) {
  const { postId } = req.params;
  const db = await getDb();

  const rows = await db.all(
    `
    SELECT c.id, c.content, c.created_at, u.username, u.name, u.avatar
    FROM comments c
    JOIN users u ON c.user_id=u.id
    WHERE c.post_id=?
    ORDER BY c.created_at ASC
  `,
    [postId]
  );

  res.json(rows);
}

export async function createComment(req, res) {
  const { postId } = req.params;
  const { content } = req.body;

  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);

  await db.run(
    `
    INSERT INTO comments (user_id, post_id, content, created_at)
    VALUES (?, ?, ?, ?)`,
    [req.userId, postId, content, now]
  );

  res.json({ success: true });
}
