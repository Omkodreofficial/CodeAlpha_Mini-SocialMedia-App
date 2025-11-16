// server/routes/notifications.js
import express from "express";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/v1/notifications
router.get("/", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const userId = req.user.id;

    const list = await db.all("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100", userId);
    res.json(list || []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/v1/notifications/:id/read
router.post("/:id/read", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    // verify ownership
    const n = await db.get("SELECT * FROM notifications WHERE id = ? AND user_id = ?", id, userId);
    if (!n) return res.status(404).json({ error: "Not found" });

    await db.run("UPDATE notifications SET read = 1 WHERE id = ?", id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
