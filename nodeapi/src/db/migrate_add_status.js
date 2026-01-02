// Adds `status` column to `destinations` if missing, and backfills "pending".
const db = require("./database");

function getColumns() {
    return new Promise((resolve, reject) => {
        db.all("PRAGMA table_info(destinations);", (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(r => r.name));
        });
    });
}

function run(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, err => (err ? reject(err) : resolve()));
    });
}

(async () => {
    try {
        const cols = await getColumns();

        if (!cols.includes("status")) {
            // Add column (nullable for existing rows), then backfill, then enforce NOT NULL via CHECK.
            await run("ALTER TABLE destinations ADD COLUMN status TEXT;");
            console.log("Added column 'status'");

            await run("UPDATE destinations SET status='pending' WHERE status IS NULL OR status='';");
            console.log("Backfilled status to 'pending'");

            // Optional: add a constraint-like guard using CHECK (SQLite can't add NOT NULL directly on ALTER)
            // Future inserts should still set status explicitly in your INSERT.
            console.log("NOTE: Ensure your INSERT sets status (e.g., 'pending' or 'approved').");
        } else {
            console.log("Column 'status' already exists");
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e.message);
        process.exit(1);
    }
})();
