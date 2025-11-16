-- server/scripts/migrate_notifications.sql

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  read INTEGER DEFAULT 0,
  created_at INTEGER
);

-- Optionally create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
