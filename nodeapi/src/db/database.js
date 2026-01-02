const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.join(__dirname, "travel_journal.db");
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error("Failed to open SQLite DB:", err.message);
    } else {
        console.log("SQLite connected:", dbFile);
    }
});

module.exports = db;
