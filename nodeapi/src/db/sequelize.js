// backend/src/db/sequelize.js
const path = require("path");
const { Sequelize } = require("sequelize");

// Adjust this path if your SQLite file lives somewhere else.
// This assumes a db folder with travel-journal.db inside backend/src/db
const dbPath = path.join(__dirname, "travel-journal.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false, // change to console.log for debugging SQL
});

module.exports = sequelize;
