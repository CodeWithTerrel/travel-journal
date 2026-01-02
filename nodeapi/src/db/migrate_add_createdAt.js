const db = require("./database");

function getCols() {
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
        const cols = await getCols();
        if (!cols.includes("createdAt")) {
            await run("ALTER TABLE destinations ADD COLUMN createdAt TEXT DEFAULT (datetime('now'));");
            console.log("Added 'createdAt'");
        } else {
            console.log("'createdAt' already exists");
        }
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e.message);
        process.exit(1);
    }
})();
