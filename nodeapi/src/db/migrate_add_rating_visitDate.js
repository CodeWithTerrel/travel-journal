// Adds rating and visitDate columns to 'destinations' if they don't exist
const db = require("./database");

function getColumns() {
    return new Promise((resolve, reject) => {
        db.all("PRAGMA table_info(destinations);", (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(r => r.name));
        });
    });
}

function addColumn(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

(async () => {
    try {
        const cols = await getColumns();

        if (!cols.includes("rating")) {
            // INTEGER with 1..5 check
            await addColumn("ALTER TABLE destinations ADD COLUMN rating INTEGER CHECK(rating BETWEEN 1 AND 5);");
            console.log("Added column 'rating'");
        } else {
            console.log("Column 'rating' already exists");
        }

        if (!cols.includes("visitDate")) {
            await addColumn("ALTER TABLE destinations ADD COLUMN visitDate TEXT;");
            console.log("Added column 'visitDate'");
        } else {
            console.log("Column 'visitDate' already exists");
        }

        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e.message);
        process.exit(1);
    }
})();
