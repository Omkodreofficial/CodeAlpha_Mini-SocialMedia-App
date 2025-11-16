// server/scripts/run_migrations.js
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function run() {
  const dbfile = path.join(process.cwd(), "database.sqlite");
  const db = await open({ filename: dbfile, driver: sqlite3.Database });
  const sql = fs.readFileSync(
    path.join(process.cwd(), "scripts", "migrate_notifications.sql"),
    "utf8"
  );
  await db.exec(sql);
  console.log("Migrations executed.");
  await db.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
