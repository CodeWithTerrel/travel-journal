const db = require("./database");

// check what's in the database
db.all("SELECT id, name, coverImagePath FROM destinations", [], (err, rows) => {
    if (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }

    console.log("\n=== DESTINATIONS IN DATABASE ===");
    rows.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Cover Image Path: ${row.coverImagePath}`);
        console.log("---");
    });

    console.log(`\nTotal: ${rows.length} destinations`);

    // check if any have null paths
    const nullPaths = rows.filter(r => !r.coverImagePath);
    if (nullPaths.length > 0) {
        console.log(`\n WARNING: ${nullPaths.length} destinations have no image path!`);
    }

    process.exit(0);
});