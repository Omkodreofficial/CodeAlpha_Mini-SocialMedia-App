// server/routes/posts.js
import express from "express";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js"; // compatibility shim / canonical both export it

const router = express.Router();

/**
 * Helper: normalize pagination query params
 */
function parsePageSize(req) {
  const page = Math.max(0, Number(req.query.page ?? 0));
  const size = Math.max(1, Math.min(100, Number(req.query.size ?? 10)));
  const offset = page * size;
  return { page, size, offset };
}

/**
 * GET /api/v1/posts/feed?page=0&size=6
 * Public feed: newest posts first, paginated.
 * Returns { posts: [ ... ], page, size }
 */
router.get("/feed", async (req, res) => {
  try {
    const db = await getDb();
    const { page, size, offset } = parsePageSize(req);

    const posts = await db.all(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.created_at,
              u.name as user_name, u.username as user_username, u.avatar as user_avatar
       FROM posts p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      size,
      offset
    );

    // add counts (likes, comments) per post in a lightweight way
    for (const p of posts) {
      const likeRow = await db.get(
        `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?`,
        p.id
      );
      const commentRow = await db.get(
        `SELECT COUNT(*) AS comments_count FROM comments WHERE post_id = ?`,
        p.id
      );
      p.likes_count = likeRow?.likes_count ?? 0;
      p.comments_count = commentRow?.comments_count ?? 0;
    }

    res.json({ posts, page, size });
  } catch (err) {
    console.error("GET /posts/feed error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/v1/posts
 * Generic posts listing (same behavior as feed).
 * Returns { posts, page, size }
 */
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const { page, size, offset } = parsePageSize(req);

    const posts = await db.all(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.created_at,
              u.name as user_name, u.username as user_username, u.avatar as user_avatar
       FROM posts p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      size,
      offset
    );

    for (const p of posts) {
      const likeRow = await db.get(
        `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?`,
        p.id
      );
      const commentRow = await db.get(
        `SELECT COUNT(*) AS comments_count FROM comments WHERE post_id = ?`,
        p.id
      );
      p.likes_count = likeRow?.likes_count ?? 0;
      p.comments_count = commentRow?.comments_count ?? 0;
    }

    res.json({ posts, page, size });
  } catch (err) {
    console.error("GET /posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/v1/posts/:postId
 * Single post view with counts and author info.
 */
router.get("/:postId", async (req, res) => {
  try {
    const db = await getDb();
    const postId = Number(req.params.postId);
    if (!postId) return res.status(400).json({ error: "Invalid post id" });

    const post = await db.get(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.created_at,
              u.name as user_name, u.username as user_username, u.avatar as user_avatar
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = ?`,
      postId
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    const likeRow = await db.get(
      `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?`,
      postId
    );
    const commentRow = await db.get(
      `SELECT COUNT(*) AS comments_count FROM comments WHERE post_id = ?`,
      postId
    );

    post.likes_count = likeRow?.likes_count ?? 0;
    post.comments_count = commentRow?.comments_count ?? 0;

    res.json(post);
  } catch (err) {
    console.error("GET /posts/:postId error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/v1/posts
 * Create a post (requires auth).
 * Body: { content: string, image_url?: string }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { content = "", image_url = "" } = req.body;
    if (!content && !image_url)
      return res
        .status(400)
        .json({ error: "Post must contain content or image_url" });

    const now = Math.floor(Date.now() / 1000);
    const result = await db.run(
      `INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?, ?, ?, ?)`,
      userId,
      content,
      image_url,
      now
    );

    const createdId = result.lastID;
    const createdPost = await db.get(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.created_at,
              u.name as user_name, u.username as user_username, u.avatar as user_avatar
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = ?`,
      createdId
    );

    res.status(201).json(createdPost);
  } catch (err) {
    console.error("POST /posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /api/v1/posts/:id
 * Edit a post (owner only).
 * Body: { content?, image_url? }
 */
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const postId = Number(req.params.id);
    const userId = Number(req.user?.id);

    if (!postId) return res.status(400).json({ error: "Invalid post id" });

    const post = await db.get(`SELECT * FROM posts WHERE id = ?`, postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user_id !== userId)
      return res.status(403).json({ error: "Not allowed" });

    const { content = post.content, image_url = post.image_url } = req.body;
    await db.run(
      `UPDATE posts SET content = ?, image_url = ? WHERE id = ?`,
      content,
      image_url,
      postId
    );

    const updated = await db.get(
      `SELECT p.id, p.user_id, p.content, p.image_url, p.created_at,
              u.name as user_name, u.username as user_username, u.avatar as user_avatar
       FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?`,
      postId
    );

    res.json(updated);
  } catch (err) {
    console.error("PATCH /posts/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/v1/posts/:id
 * Delete a post (owner only).
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const postId = Number(req.params.id);
    const userId = Number(req.user?.id);

    if (!postId) return res.status(400).json({ error: "Invalid post id" });

    const post = await db.get(`SELECT * FROM posts WHERE id = ?`, postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user_id !== userId)
      return res.status(403).json({ error: "Not allowed" });

    await db.run(`DELETE FROM posts WHERE id = ?`, postId);
    // Optionally clear related likes/comments
    await db.run(`DELETE FROM likes WHERE post_id = ?`, postId);
    await db.run(`DELETE FROM comments WHERE post_id = ?`, postId);

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /posts/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/v1/posts/:id/like
 * POST /api/v1/posts/:id/unlike
 */
router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const postId = Number(req.params.id);
    const userId = Number(req.user?.id);
    if (!postId) return res.status(400).json({ error: "Invalid post id" });

    // check exists
    const post = await db.get(`SELECT id FROM posts WHERE id = ?`, postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // avoid duplicate like
    const existing = await db.get(
      `SELECT id FROM likes WHERE user_id = ? AND post_id = ?`,
      userId,
      postId
    );
    if (existing) return res.json({ ok: true, liked: true });

    await db.run(
      `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`,
      userId,
      postId
    );

    const likeRow = await db.get(
      `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?`,
      postId
    );
    res.json({ ok: true, liked: true, likes_count: likeRow?.likes_count ?? 0 });
  } catch (err) {
    console.error("POST /posts/:id/like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/unlike", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const postId = Number(req.params.id);
    const userId = Number(req.user?.id);
    if (!postId) return res.status(400).json({ error: "Invalid post id" });

    await db.run(
      `DELETE FROM likes WHERE user_id = ? AND post_id = ?`,
      userId,
      postId
    );
    const likeRow = await db.get(
      `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ?`,
      postId
    );

    res.json({
      ok: true,
      liked: false,
      likes_count: likeRow?.likes_count ?? 0,
    });
  } catch (err) {
    console.error("POST /posts/:id/unlike error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
