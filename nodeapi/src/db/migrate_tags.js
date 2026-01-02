// backend/src/db/migrate_tags.js
const path = require("path");
const db = require("./database");

console.log("SQLite connected:", path.join(__dirname, "travel_journal.db"));

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS tags (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT NOT NULL,
           type TEXT NOT NULL,           -- 'mood' or 'activity'
           createdAt TEXT NOT NULL
         )`,
        (err) => {
            if (err) console.error("Error creating tags table:", err.message);
            else console.log("Tags table ok");
        }
    );
});

db.close(() => {
    console.log("Tags migration complete.");
});
