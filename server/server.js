// server/server.js
import "dotenv/config"; // MUST be first so all modules see process.env
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { initDb } from "./db.js";
import logger from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

// routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import followRoutes from "./routes/follows.js";
import uploadRoutes from "./routes/upload.js";
import notificationsRoutes from "./routes/notifications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// CORS safe: allow from frontend dev origin(s)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(logger); // logs every request

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// IMPORTANT: mount all routers under /api/v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/upload", uploadRoutes);

// TEMP debug route (safe)
app.post("/api/v1/auth/register-debug", (req, res) => {
  console.log("🔥 TEMP ROUTE HIT /api/v1/auth/register-debug");
  res.json({ ok: true });
});

// list routes debug
app.get("/__routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(middleware.route);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach(function (handler) {
        const route = handler.route;
        route && routes.push(route);
      });
    }
  });
  const formatted = routes.map((r) => {
    const methods = Object.keys(r.methods).join(",").toUpperCase();
    return `${methods} ${r.path}`;
  });
  res.json({ routes: formatted });
});

// central error handler
app.use(errorHandler);

// initialize DB then start server
initDb()
  .then(() => {
    console.log("Database initialized ✔");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB INIT ERROR:", err);
    process.exit(1);
  });
