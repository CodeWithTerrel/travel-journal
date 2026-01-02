// backend/src/db/migrate_add_user_to_destinations.js
const db = require("./database");

db.serialize(() => {
    // Try to add userId column; ignore if it already exists
    db.run(
        "ALTER TABLE destinations ADD COLUMN userId INTEGER",
        (err) => {
            if (err) {
                if (err.message && err.message.includes("duplicate column name")) {
                    console.log("destinations.userId already exists, skipping.");
                } else {
                    console.error("Error adding userId to destinations:", err.message);
                }
            } else {
                console.log("destinations.userId column added.");
            }
        }
    );
});

db.close(() => {
    console.log("Migration complete.");
});
