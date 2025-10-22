const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "travel_journal.db");
const db = new sqlite3.Database(DB_PATH);

module.exports = db;
