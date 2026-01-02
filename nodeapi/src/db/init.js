const db = require("./database");

const sql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  coverImagePath TEXT,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  visitDate TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TEXT DEFAULT (datetime('now'))
);
`;

db.exec(sql, (err) => {
    if (err) {
        console.error("DB init error:", err.message);
        process.exit(1);
    }
    console.log("SQLite tables ready (destinations).");
    process.exit(0);
});
