// server/routes/follows.js
import express from "express";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/v1/follows/:id/follow
router.post("/:id/follow", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const followeeId = parseInt(req.params.id);
    const followerId = req.user.id;

    if (followerId === followeeId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    // avoid duplicate
    const existing = await db.get(
      "SELECT id FROM follows WHERE follower_id = ? AND followee_id = ?",
      followerId,
      followeeId
    );
    if (existing) return res.json({ ok: true, message: "Already following" });

    await db.run(
      "INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)",
      followerId,
      followeeId
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/v1/follows/:id/unfollow
router.post("/:id/unfollow", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const followeeId = parseInt(req.params.id);
    const followerId = req.user.id;

    await db.run(
      "DELETE FROM follows WHERE follower_id = ? AND followee_id = ?",
      followerId,
      followeeId
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
