// server/scripts/list_users.js
import { getDb } from "../db.js";

(async () => {
  const db = await getDb();
  const rows = await db.all("SELECT id, username, name, created_at FROM users");
  console.log("users:", rows);
  process.exit(0);
})();
