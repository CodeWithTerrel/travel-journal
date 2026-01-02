// backend/src/routes/destinations.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("../db/database");
const { upload, cleanupFiles } = require("../middleware/upload");
const { validateDestination } = require("../middleware/validate");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

/**
 * GET /api/destinations
 * Filters:
 *  - status: approved|pending|rejected (default: approved)
 *  - country: exact match
 *  - hasComments: true|false  (true => description not null/empty)
 *  - minRating: 1..5
 *  - page, pageSize (default 1, 9)
 */
router.get("/", (req, res) => {
    const {
        status = "approved",
        country,
        hasComments,
        minRating,
        page = 1,
        pageSize = 9,
    } = req.query;

    const where = [];
    const params = [];

    if (status) {
        where.push("status = ?");
        params.push(String(status));
    }
    if (country) {
        where.push("LOWER(country) = LOWER(?)");
        params.push(country);
    }
    if (hasComments === "true") {
        where.push("(description IS NOT NULL AND TRIM(description) != '')");
    }
    if (hasComments === "false") {
        where.push("(description IS NULL OR TRIM(description) = '')");
    }
    if (minRating) {
        where.push("rating >= ?");
        params.push(Number(minRating));
    }

    const base = `FROM destinations ${
        where.length ? "WHERE " + where.join(" AND ") : ""
    }`;

    const limit = Math.max(1, Number(pageSize));
    const offset = (Math.max(1, Number(page)) - 1) * limit;

    const sqlData = `SELECT * ${base} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const sqlCount = `SELECT COUNT(1) AS total ${base}`;

    db.get(sqlCount, params, (err, countRow) => {
        if (err) return res.status(500).json({ message: err.message });

        db.all(sqlData, [...params, limit, offset], (e2, rows) => {
            if (e2) return res.status(500).json({ message: e2.message });
            res.json({
                items: rows || [],
                page: Number(page),
                pageSize: limit,
                total: countRow.total,
                totalPages: Math.max(
                    1,
                    Math.ceil((countRow.total || 0) / limit)
                ),
            });
        });
    });
});

/**
 * ADMIN: list all pending (no paging)
 */
router.get("/admin/pending/list", adminOnly, (req, res) => {
    db.all(
        "SELECT * FROM destinations WHERE status='pending' ORDER BY createdAt DESC",
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows || []);
        }
    );
});

// Single destination by ID
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM destinations WHERE id = ?",
        [req.params.id],
        (err, dest) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!dest) return res.status(404).json({ message: "Not found" });
            res.json({ destination: dest });
        }
    );
});

/**
 * POST /api/destinations
 * Public create (guest). New items are 'pending'.
 * Fields: name, country, city, description, rating, visitDate, cover (file)
 */
router.post("/", upload.single("cover"), (req, res) => {
    const body = req.body || {};
    const { valid, errors } = validateDestination(body);

    if (!valid) {
        if (req.file) cleanupFiles(req.file);
        return res.status(400).json({ errors });
    }

    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
        INSERT INTO destinations
          (name, country, city, description, coverImagePath, rating, visitDate, status)
        VALUES (?,?,?,?,?,?,?, 'pending')
    `;

    const params = [
        body.name,
        body.country,
        body.city,
        body.description || null,
        coverPath,
        Number(body.rating) || null,
        body.visitDate || null,
    ];

    db.run(sql, params, function (err) {
        if (err) {
            if (req.file) cleanupFiles(req.file);
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ id: this.lastID, status: "pending" });
    });
});

/**
 * SHARED UPDATE HANDLER
 * Used for both PUT and PATCH /api/destinations/:id
 * - Admin: can edit any destination
 * - Logged-in user: can edit only their own destination (createdByUserId)
 * - Guest: 403
 */
function updateDestination(req, res) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    const body = req.body || {};
    const { valid, errors } = validateDestination(body);
    if (!valid) {
        return res.status(400).json({ errors });
    }

    const userIdCookie = req.cookies?.userId;
    const role = req.cookies?.role || "";

    if (!userIdCookie && role !== "admin") {
        return res
            .status(403)
            .json({ message: "You must be logged in to edit destinations" });
    }

    const userId = userIdCookie ? Number(userIdCookie) : null;

    const baseParams = [
        body.name,
        body.country,
        body.city,
        body.description || null,
        body.rating !== undefined && body.rating !== ""
            ? Number(body.rating)
            : null,
        body.visitDate || null,
    ];

    let sql;
    let params;

    if (role === "admin") {
        // admin can edit any row by id
        sql = `
            UPDATE destinations
            SET name = ?,
                country = ?,
                city = ?,
                description = ?,
                rating = ?,
                visitDate = ?
            WHERE id = ?
        `;
        params = [...baseParams, id];
    } else {
        // normal user can edit only their own posts
        sql = `
            UPDATE destinations
            SET name = ?,
                country = ?,
                city = ?,
                description = ?,
                rating = ?,
                visitDate = ?
            WHERE id = ? AND createdByUserId = ?
        `;
        params = [...baseParams, id, userId];
    }

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Destination update error:", err.message);
            return res.status(500).json({ message: err.message });
        }
        if (this.changes === 0) {
            // either id not found, or user is not owner
            return res.status(404).json({ message: "Not found" });
        }
        return res.json({ ok: true });
    });
}

// mount update handler on both verbs
router.put("/:id", updateDestination);
router.patch("/:id", updateDestination);

/** Moderation action - approve */
router.patch("/:id/approve", adminOnly, (req, res) => {
    db.run(
        `UPDATE destinations SET status='approved' WHERE id=?`,
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ message: "Not found" });
            }
            res.json({ ok: true });
        }
    );
});

/** Moderation action - reject */
router.patch("/:id/reject", adminOnly, (req, res) => {
    db.run(
        `UPDATE destinations SET status='rejected' WHERE id=?`,
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ message: "Not found" });
            }
            res.json({ ok: true });
        }
    );
});

/** DELETE endpoint - admin only, delete destination permanently */
router.delete("/:id", adminOnly, (req, res) => {
    console.log("Delete request for ID:", req.params.id);

    db.get(
        "SELECT coverImagePath FROM destinations WHERE id=?",
        [req.params.id],
        (err, dest) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: err.message });
            }

            if (!dest) {
                console.log("Destination not found");
                return res.status(404).json({ message: "Not found" });
            }

            db.run(
                "DELETE FROM destinations WHERE id=?",
                [req.params.id],
                function (delErr) {
                    if (delErr) {
                        console.error("Delete error:", delErr);
                        return res
                            .status(500)
                            .json({ message: delErr.message });
                    }

                    if (dest.coverImagePath) {
                        try {
                            const relativePath = dest.coverImagePath.replace(
                                /^\/+/,
                                ""
                            );
                            const imagePath = path.join(
                                __dirname,
                                "..",
                                "..",
                                relativePath
                            );

                            if (fs.existsSync(imagePath)) {
                                fs.unlinkSync(imagePath);
                                console.log("Image file deleted");
                            } else {
                                console.log(
                                    "Image file does not exist, skipping"
                                );
                            }
                        } catch (fileErr) {
                            console.error(
                                "Failed to delete image file:",
                                fileErr.message
                            );
                        }
                    }

                    res.json({ ok: true, message: "Destination deleted" });
                }
            );
        }
    );
});

module.exports = router;
