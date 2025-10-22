const db = require("./database");

db.run(
    `INSERT INTO destinations (name, country, city, description, coverImagePath)
   VALUES (?, ?, ?, ?, ?)`,
    [
        "Canadian Museum",
        "Canada",
        "Manitoba",
        "Sample museum to match your mockups.",
        null
    ],
    function (err) {
        if (err) {
            console.error("Seed error:", err.message);
            process.exit(1);
        }
        console.log("Seeded destination with id:", this.lastID);
        process.exit(0);
    }
);
