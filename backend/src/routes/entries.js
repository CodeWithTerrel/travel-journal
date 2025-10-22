const express = require("express");
const db = require("../db/database");
const { upload, cleanupFiles } = require("../middleware/upload");
const { validateEntry } = require("../middleware/validate");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Public: create entry (guest allowed) -> status: pending
router.post("/", upload.array("photos", 5), (req, res) => {
    const body = req.body || {};
    const { valid, errors } = validateEntry(body);
    if (!valid) {
        cleanupFiles(req.files);
        return res.status(400).json({ errors });
    }

    const photos = (req.files || []).map(f => `/uploads/${f.filename}`);
    const sql = `INSERT INTO journal_entries
    (destinationId, title, body, visitDate, rating, photoPaths, authorDisplay, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

    const params = [
        Number(body.destinationId),
        body.title,
        body.body || null,
        body.visitDate,
        Number(body.rating),
        JSON.stringify(photos),
        body.authorDisplay || "Guest"
    ];

    db.run(sql, params, function (err) {
        if (err) {
            cleanupFiles(req.files);
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ id: this.lastID, status: "pending" });
    });
});

// Admin: list pending entries
router.get("/", (req, res) => {
    const status = req.query.status || "approved";
    const sql = `SELECT * FROM journal_entries WHERE status = ? ORDER BY createdAt DESC`;
    db.all(sql, [status], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// Admin: approve
router.patch("/:id/approve", adminOnly, (req, res) => {
    db.run(`UPDATE journal_entries SET status='approved' WHERE id=?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Not found" });
        res.json({ ok: true });
    });
});

// Admin: reject
router.patch("/:id/reject", adminOnly, (req, res) => {
    db.run(`UPDATE journal_entries SET status='rejected' WHERE id=?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Not found" });
        res.json({ ok: true });
    });
});

module.exports = router;
