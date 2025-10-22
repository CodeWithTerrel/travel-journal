const express = require("express");
const db = require("../db/database");
const { upload, cleanupFiles } = require("../middleware/upload");
const { validateDestination } = require("../middleware/validate");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// List all destinations
router.get("/", (req, res) => {
    db.all("SELECT * FROM destinations ORDER BY createdAt DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// Destination detail + approved entries
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM destinations WHERE id = ?", [id], (err, dest) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!dest) return res.status(404).json({ message: "Not found" });

        db.all(
            "SELECT * FROM journal_entries WHERE destinationId = ? AND status = 'approved' ORDER BY createdAt DESC",
            [id],
            (e2, entries) => {
                if (e2) return res.status(500).json({ message: e2.message });
                res.json({ destination: dest, entries });
            }
        );
    });
});

// Create destination (admin)
router.post("/", adminOnly, upload.single("cover"), (req, res) => {
    const body = req.body || {};
    const { valid, errors } = validateDestination(body);

    if (!valid) {
        // remove uploaded file if validation failed
        if (req.file) cleanupFiles(req.file);
        return res.status(400).json({ errors });
    }

    const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = `INSERT INTO destinations (name,country,city,description,coverImagePath)
               VALUES (?,?,?,?,?)`;
    const params = [body.name, body.country, body.city, body.description || null, coverImagePath];

    db.run(sql, params, function (err) {
        if (err) {
            if (req.file) cleanupFiles(req.file);
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

module.exports = router;
