// backend/src/routes/google_oauth.js
const express = require("express");
const axios = require("axios");
const db = require("../db/database");

const router = express.Router();

// Google OAuth config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// This must match your Google Console redirect URI exactly
const GOOGLE_REDIRECT_URI = "http://localhost:8080/oauth/google/callback";

// Helper: set auth cookies (same behaviour as /api/auth/login)
function setAuthCookies(res, user) {
    const opts = {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("userId", String(user.id), opts);
    res.cookie("role", user.role || "user", opts);

    if (user.role === "admin") {
        res.cookie("admin", "1", opts);
    } else {
        res.clearCookie("admin");
    }
}

/**
 * STEP 1: Redirect user to Google's consent screen
 * GET /oauth/google
 */
router.get("/oauth/google", (req, res) => {
    const base = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        prompt: "consent",
    });

    const url = `${base}?${params.toString()}`;
    return res.redirect(url);
});

/**
 * STEP 2: Google sends us a code
 * GET /oauth/google/callback?code=...
 */
router.get("/oauth/google/callback", async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        console.error("Google OAuth error param:", error);
        return res.status(400).send("Google OAuth error");
    }

    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    try {
        // Exchange code for tokens
        const tokenRes = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const { id_token } = tokenRes.data;

        if (!id_token) {
            console.error("No id_token in Google response:", tokenRes.data);
            return res.status(500).send("Invalid Google response");
        }

        // Decode ID token (JWT payload is base64 in the middle section)
        const payload = JSON.parse(
            Buffer.from(id_token.split(".")[1], "base64").toString()
        );

        const email = payload.email;
        const displayName = payload.name || "Google User";

        if (!email) {
            console.error("Google did not return an email:", payload);
            return res.status(500).send("Google account has no email");
        }

        // Look up existing user
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
            if (err) {
                console.error("DB error during Google login:", err.message);
                return res.status(500).send("Database error");
            }

            if (!user) {
                // Create a new normal user
                db.run(
                    `
                    INSERT INTO users (displayName, email, password, role)
                    VALUES (?, ?, ?, ?)
                `,
                    [displayName, email, "", "user"],
                    function (insertErr) {
                        if (insertErr) {
                            console.error(
                                "Failed to insert Google user:",
                                insertErr.message
                            );
                            return res.status(500).send("Failed to create user");
                        }

                        const newUser = {
                            id: this.lastID,
                            displayName,
                            email,
                            role: "user",
                        };

                        setAuthCookies(res, newUser);

                        // Redirect back to your frontend home (or profile)
                        return res.redirect("http://localhost:5173/");
                    }
                );
            } else {
                // Existing user
                const existingUser = {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email,
                    role: user.role || "user",
                };

                setAuthCookies(res, existingUser);

                return res.redirect("http://localhost:5173/");
            }
        });
    } catch (e) {
        console.error(
            "Google OAuth callback error:",
            e.response?.data || e.message
        );
        res.status(500).send("OAuth failed");
    }
});

module.exports = router;
