// backend/src/routes/auth.js
const express = require("express");
const db = require("../db/database");

const router = express.Router();

// Your required admin credentials
const ADMIN_EMAIL = "test@t.ca";
const ADMIN_PASSWORD = "123456Pw";

/**
 * Helper: set auth cookies for a user
 */
function setAuthCookies(res, user, rememberMe) {
    const baseOpts = {
        httpOnly: true,
        sameSite: "lax",
        path: "/", // make cookies visible to all routes
    };

    const opts = rememberMe
        ? { ...baseOpts, maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
        : baseOpts;

    res.cookie("userId", String(user.id), opts);
    res.cookie("role", user.role || "user", opts);

    if (user.role === "admin") {
        res.cookie("admin", "1", opts);
    } else {
        res.clearCookie("admin", { path: "/" });
    }
}

/**
 * Ensure the admin user exists in DB.
 * If not, create it with the known credentials.
 */
function ensureAdminUser(cb) {
    db.get(
        "SELECT * FROM users WHERE email = ?",
        [ADMIN_EMAIL],
        (err, user) => {
            if (err) {
                console.error("ensureAdminUser DB error:", err.message);
                return cb(err);
            }
            if (user) return cb(null, user);

            // Create admin if missing
            db.run(
                `
          INSERT INTO users (displayName, email, password, role)
          VALUES ('Admin', ?, ?, 'admin')
        `,
                [ADMIN_EMAIL, ADMIN_PASSWORD],
                function (insertErr) {
                    if (insertErr) {
                        console.error("Failed to create admin user:", insertErr.message);
                        return cb(insertErr);
                    }
                    db.get(
                        "SELECT * FROM users WHERE id = ?",
                        [this.lastID],
                        (err2, newAdmin) => {
                            if (err2) return cb(err2);
                            cb(null, newAdmin);
                        }
                    );
                }
            );
        }
    );
}

/**
 * POST /api/auth/login
 * Body: { email, password, remember? }
 */
router.post("/login", (req, res) => {
    const { email, password, remember } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {
            if (err) {
                console.error("Login DB error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }

            // If we found a user in DB, check password normally
            if (user && user.password === password) {
                setAuthCookies(res, user, !!remember);
                return res.json({
                    ok: true,
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    role: user.role,
                });
            }

            // Special case: if credentials match the required admin,
            // make sure admin exists (create if missing), then log in.
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                return ensureAdminUser((adminErr, adminUser) => {
                    if (adminErr || !adminUser) {
                        return res
                            .status(500)
                            .json({ message: "Failed to ensure admin user" });
                    }
                    setAuthCookies(res, adminUser, !!remember);
                    return res.json({
                        ok: true,
                        id: adminUser.id,
                        email: adminUser.email,
                        displayName: adminUser.displayName,
                        role: adminUser.role,
                    });
                });
            }

            // Otherwise, invalid credentials
            return res.status(401).json({ message: "Invalid credentials" });
        }
    );
});

/**
 * POST /api/auth/google-jwt
 * Body: { credential }
 * Used by React Google Login to exchange a Google ID token for our own JWT.
 */
router.post("/google-jwt", (req, res) => {
    const { credential } = req.body || {};

    if (!credential) {
        return res.status(400).json({ message: "Missing Google credential" });
    }

    const axios = require("axios");
    const jwt = require("jsonwebtoken");

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

    // Verify Google ID token using Google's tokeninfo endpoint
    axios
        .get("https://oauth2.googleapis.com/tokeninfo", {
            params: { id_token: credential },
        })
        .then((response) => {
            const payload = response.data;

            // Optional: check audience matches our client ID, if configured
            if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
                console.error(
                    "Google token audience mismatch:",
                    payload.aud,
                    "expected:",
                    GOOGLE_CLIENT_ID
                );
                return res.status(401).json({ message: "Invalid Google token" });
            }

            const email = payload.email;
            const displayName = payload.name || email;

            if (!email) {
                return res
                    .status(400)
                    .json({ message: "Google token missing email claim" });
            }

            // Find or create user in local DB
            db.get(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, existingUser) => {
                    if (err) {
                        console.error("Google JWT login DB error:", err.message);
                        return res
                            .status(500)
                            .json({ message: "Database error during Google login" });
                    }

                    const finishLogin = (user) => {
                        // Reuse existing cookie-based auth for compatibility
                        setAuthCookies(res, user, true); // treat Google logins as rememberMe=true

                        // Sign our own JWT so frontend can store/forward it if needed
                        const tokenPayload = {
                            id: user.id,
                            email: user.email,
                            displayName: user.displayName,
                            role: user.role,
                        };

                        const token = jwt.sign(tokenPayload, JWT_SECRET, {
                            expiresIn: "7d",
                        });

                        return res.json({
                            ok: true,
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                displayName: user.displayName,
                                role: user.role,
                            },
                        });
                    };

                    if (existingUser) {
                        return finishLogin(existingUser);
                    }

                    // No user yet: create one with empty password but valid NOT NULL constraint
                    db.run(
                        `
            INSERT INTO users (displayName, email, password, role)
            VALUES (?, ?, ?, 'user')
          `,
                        [displayName, email, ""],
                        function (insertErr) {
                            if (insertErr) {
                                console.error(
                                    "Failed to create Google JWT user:",
                                    insertErr.message
                                );
                                return res
                                    .status(500)
                                    .json({ message: "Failed to create Google user" });
                            }

                            db.get(
                                "SELECT * FROM users WHERE id = ?",
                                [this.lastID],
                                (loadErr, newUser) => {
                                    if (loadErr || !newUser) {
                                        console.error(
                                            "Failed to load new Google user:",
                                            loadErr?.message
                                        );
                                        return res.status(500).json({
                                            message: "Failed to load created Google user",
                                        });
                                    }
                                    return finishLogin(newUser);
                                }
                            );
                        }
                    );
                }
            );
        })
        .catch((err) => {
            console.error(
                "Error verifying Google ID token:",
                err.response?.data || err.message
            );
            return res.status(401).json({ message: "Invalid Google token" });
        });
});

/**
 * POST /api/auth/logout
 * Clears auth cookies
 */
router.post("/logout", (req, res) => {
    res.clearCookie("userId", { path: "/" });
    res.clearCookie("role", { path: "/" });
    res.clearCookie("admin", { path: "/" });
    res.json({ ok: true });
});

/**
 * GET /api/auth/check
 * Used by frontend to know if user is admin / logged in
 */
router.get("/check", (req, res) => {
    const userId = req.cookies?.userId;
    const role = req.cookies?.role;
    const isAdmin = role === "admin" || req.cookies?.admin === "1";

    res.json({
        isLoggedIn: !!userId,
        isAdmin,
        role: role || null,
    });
});

/**
 * GET /api/auth/me
 * Returns the current logged-in user (or null)
 */
router.get("/me", (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        return res.json({ user: null });
    }

    db.get(
        "SELECT id, displayName, email, role, createdAt, updatedAt FROM users WHERE id = ?",
        [userId],
        (err, user) => {
            if (err) {
                console.error("Auth /me error:", err.message);
                return res.status(500).json({ message: "Database error" });
            }
            if (!user) return res.json({ user: null });
            res.json({ user });
        }
    );
});

module.exports = router;
