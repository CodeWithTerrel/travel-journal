const db = require("./database");

// Create tables if they don't exist
const sql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  coverImagePath TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destinationId INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  visitDate TEXT NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  photoPaths TEXT, -- JSON array of strings
  authorDisplay TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (destinationId) REFERENCES destinations(id) ON DELETE CASCADE
);
`;

db.exec(sql, (err) => {
    if (err) {
        console.error("DB init error:", err.message);
        process.exit(1);
    }
    console.log("SQLite tables are ready.");
    process.exit(0);
});
