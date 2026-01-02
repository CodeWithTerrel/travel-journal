// backend/src/routes/users.js
const express = require("express");
const db = require("../db/database");
const adminOnly = require("../middleware/adminOnly");
const requireUser = require("../middleware/requireUser");

const router = express.Router();

// PUBLIC: register a new user
router.post("/register", (req, res) => {
    const { displayName, email, password } = req.body || {};
    const errors = {};

    if (!displayName || !displayName.trim()) errors.displayName = "Display name required";
    if (!email || !email.trim()) errors.email = "Email required";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
    }

    db.run(
        `
      INSERT INTO users (displayName, email, password, role)
      VALUES (?, ?, ?, 'user')
    `,
        [displayName.trim(), email.trim(), password],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({ message: "Email already in use" });
                }
                console.error("Register error:", err);
                return res.status(500).json({ message: err.message });
            }

            const id = this.lastID;

            // auto-login the new user
            res.cookie("userId", String(id), {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.clearCookie("admin");

            return res.status(201).json({
                ok: true,
                user: { id, displayName, email, role: "user" },
            });
        }
    );
});

// USER: get own profile
router.get("/me", requireUser, (req, res) => {
    db.get("SELECT id, displayName, email, role FROM users WHERE id = ?", [req.userId], (err, user) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    });
});

// USER: update own profile (displayName and/or password)
router.put("/me", requireUser, (req, res) => {
    const { displayName, password } = req.body || {};
    const fields = [];
    const params = [];

    if (displayName && displayName.trim()) {
        fields.push("displayName = ?");
        params.push(displayName.trim());
    }
    if (password && password.length >= 6) {
        fields.push("password = ?");
        params.push(password);
    }

    if (!fields.length) {
        return res.status(400).json({ message: "Nothing to update" });
    }

    params.push(req.userId);

    db.run(
        `UPDATE users SET ${fields.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        params,
        function (err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) return res.status(404).json({ message: "User not found" });
            res.json({ ok: true });
        }
    );
});

// ADMIN: list users
router.get("/", adminOnly, (req, res) => {
    db.all(
        "SELECT id, displayName, email, role, createdAt FROM users ORDER BY createdAt DESC",
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ users: rows });
        }
    );
});

// ADMIN: delete user
router.delete("/:id", adminOnly, (req, res) => {
    const id = Number(req.params.id);

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "User not found" });
        res.json({ ok: true });
    });
});

module.exports = router;
