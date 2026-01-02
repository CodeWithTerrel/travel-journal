// backend/src/routes/tags.js
const express = require("express");
const db = require("../db/database");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

/**
 * Helper to fetch tags by type
 */
function listTags(type, res) {
    db.all(
        "SELECT id, name, type, createdAt FROM tags WHERE type = ? ORDER BY name ASC",
        [type],
        (err, rows) => {
            if (err) {
                console.error("Tags list error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }
            return res.json({ items: rows || [] });
        }
    );
}

/**
 * PUBLIC: GET /api/tags/mood
 */
router.get("/mood", (req, res) => {
    listTags("mood", res);
});

/**
 * PUBLIC: GET /api/tags/activity
 */
router.get("/activity", (req, res) => {
    listTags("activity", res);
});

/**
 * ADMIN: POST /api/tags/mood
 * Body: { name }
 */
router.post("/mood", adminOnly, (req, res) => {
    const name = (req.body?.name || "").trim();
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    const now = new Date().toISOString();

    db.run(
        `INSERT INTO tags (name, type, createdAt)
         VALUES (?, 'mood', ?)`,
        [name, now],
        function (err) {
            if (err) {
                console.error("Insert mood tag error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }

            return res.status(201).json({
                id: this.lastID,
                name,
                type: "mood",
                createdAt: now,
            });
        }
    );
});

/**
 * ADMIN: POST /api/tags/activity
 * Body: { name }
 */
router.post("/activity", adminOnly, (req, res) => {
    const name = (req.body?.name || "").trim();
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    const now = new Date().toISOString();

    db.run(
        `INSERT INTO tags (name, type, createdAt)
         VALUES (?, 'activity', ?)`,
        [name, now],
        function (err) {
            if (err) {
                console.error("Insert activity tag error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }

            return res.status(201).json({
                id: this.lastID,
                name,
                type: "activity",
                createdAt: now,
            });
        }
    );
});

/**
 * ADMIN: DELETE /api/tags/mood/:id
 */
router.delete("/mood/:id", adminOnly, (req, res) => {
    const id = Number(req.params.id);

    db.run(
        "DELETE FROM tags WHERE id = ? AND type = 'mood'",
        [id],
        function (err) {
            if (err) {
                console.error("Delete mood tag error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Tag not found" });
            }
            return res.json({ ok: true });
        }
    );
});

/**
 * ADMIN: DELETE /api/tags/activity/:id
 */
router.delete("/activity/:id", adminOnly, (req, res) => {
    const id = Number(req.params.id);

    db.run(
        "DELETE FROM tags WHERE id = ? AND type = 'activity'",
        [id],
        function (err) {
            if (err) {
                console.error("Delete activity tag error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Tag not found" });
            }
            return res.json({ ok: true });
        }
    );
});

module.exports = router;
