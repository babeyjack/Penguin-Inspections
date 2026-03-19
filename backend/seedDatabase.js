const fs = require("fs");
const path = require("path");
const db = require("./db/connection");

const SEED_PATH = process.env.DEV_SEED_PATH || path.join(__dirname, "../mySQL/dev-seed-full.sql");

async function ensureSeeded() {
  try {
    const [rows] = await db.promise().query("SHOW TABLES LIKE 'users'");
    if (rows.length === 0) {
      console.log("No users table found; seeding database from", SEED_PATH);
      const sql = fs.readFileSync(SEED_PATH, "utf8");
      await db.promise().query(sql);
      console.log("Database seeded successfully.");
    } else {
      console.log("Database already seeded (users table exists).");
    }
  } catch (err) {
    console.error("Database seeding error:", err);
  }
}

module.exports = { ensureSeeded };
