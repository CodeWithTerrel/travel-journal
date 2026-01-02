// backend/src/db/migrate_users_journals.js
const path = require("path");
const db = require("./database");

console.log("SQLite connected:", path.join(__dirname, "travel_journal.db"));

db.serialize(() => {
    // USERS TABLE
    db.run(
        `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      displayName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `,
        (err) => {
            if (err) console.error("Error creating users table:", err.message);
            else console.log("Users table ok");
        }
    );

    // JOURNALS TABLE
    db.run(
        `
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destinationId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      rating INTEGER,
      visitDate TEXT,
      moodTag TEXT,
      activityTag TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(destinationId) REFERENCES destinations(id) ON DELETE CASCADE,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
        (err) => {
            if (err) console.error("Error creating journals table:", err.message);
            else console.log("Journals table ok");
        }
    );

    // TAGS TABLE (NEW)
    db.run(
        `
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `,
        (err) => {
            if (err) console.error("Error creating tags table:", err.message);
            else console.log("Tags table ok");
        }
    );

    // SEED ADMIN USER (current credentials)
    db.run(
        `
    INSERT OR IGNORE INTO users (displayName, email, password, role)
    VALUES ('Admin', 'test@t.ca', '123456Pw', 'admin')
  `,
        (err) => {
            if (err) console.error("Error seeding admin user:", err.message);
            else console.log("Admin user ensured");
        }
    );
});

db.close(() => {
    console.log("Migration complete.");
});
