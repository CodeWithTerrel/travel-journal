// backend/src/routes/journals.js
const express = require("express");
const db = require("../db/database");
const adminOnly = require("../middleware/adminOnly");
const { validateJournal } = require("../middleware/validate");

const router = express.Router();

/**
 * GET /api/journals
 * Optional query:
 *   - destinationId: filter by a specific destination
 */
router.get("/", (req, res) => {
    const { destinationId } = req.query;

    const where = [];
    const params = [];

    if (destinationId) {
        where.push("j.destinationId = ?");
        params.push(Number(destinationId));
    }

    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

    const sql = `
      SELECT
        j.*,
        d.name   AS destinationName,
        d.city   AS destinationCity,
        d.country AS destinationCountry
      FROM journals j
      JOIN destinations d ON j.destinationId = d.id
      ${whereSql}
      ORDER BY j.createdAt DESC
    `;

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows || []);
    });
});

/**
 * GET /api/journals/:id
 */
router.get("/:id", (req, res) => {
    const sql = `
      SELECT
        j.*,
        d.name   AS destinationName,
        d.city   AS destinationCity,
        d.country AS destinationCountry
      FROM journals j
      JOIN destinations d ON j.destinationId = d.id
      WHERE j.id = ?
    `;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!row) return res.status(404).json({ message: "Not found" });
        res.json(row);
    });
});

/**
 * POST /api/journals
 * Admin only (for now)
 * Body: destinationId, title, notes, rating?, visitDate?, moodTag?, activityTag?
 */
router.post("/", adminOnly, (req, res) => {
    const body = req.body || {};
    const { valid, errors } = validateJournal(body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const now = new Date().toISOString();

    // For now tie all journals to admin user id 1
    const userId = 1;

    const sql = `
      INSERT INTO journals
        (destinationId, userId, title, notes, rating, visitDate, moodTag, activityTag, createdAt, updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    const params = [
        Number(body.destinationId),
        userId,
        body.title.trim(),
        body.notes || null,
        body.rating !== undefined && body.rating !== "" ? Number(body.rating) : null,
        body.visitDate || null,
        body.moodTag || null,
        body.activityTag || null,
        now,
        now,
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

/**
 * PATCH /api/journals/:id
 * Admin only (for now)
 */
router.patch("/:id", adminOnly, (req, res) => {
    const body = req.body || {};
    const { valid, errors } = validateJournal(body);

    if (!valid) {
        return res.status(400).json({ errors });
    }

    const now = new Date().toISOString();

    const sql = `
      UPDATE journals
      SET destinationId = ?,
          title         = ?,
          notes         = ?,
          rating        = ?,
          visitDate     = ?,
          moodTag       = ?,
          activityTag   = ?,
          updatedAt     = ?
      WHERE id = ?
    `;

    const params = [
        Number(body.destinationId),
        body.title.trim(),
        body.notes || null,
        body.rating !== undefined && body.rating !== "" ? Number(body.rating) : null,
        body.visitDate || null,
        body.moodTag || null,
        body.activityTag || null,
        now,
        req.params.id,
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Not found" });
        res.json({ ok: true });
    });
});

/**
 * DELETE /api/journals/:id
 * Admin only (for now)
 */
router.delete("/:id", adminOnly, (req, res) => {
    db.run("DELETE FROM journals WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Not found" });
        res.json({ ok: true });
    });
});

module.exports = router;
