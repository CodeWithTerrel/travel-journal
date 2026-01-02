// backend/src/app.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Ensure DB file exists / connected for the legacy sqlite3 layer
require("./db/database");

// Import Sequelize + models so we can sync ORM (new requirement)
const { sequelize } = require("./models");

const app = express();

// --- CORS (allow frontend to talk to API with cookies) ---
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
    cors({
        origin: FRONTEND_ORIGIN,
        credentials: true,
    })
);

// --- Core middlewares ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve uploaded images ---
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// --- Routes ---
const authRoutes = require("./routes/auth");
const destinationRoutes = require("./routes/destinations");

// optional routes that you already have
let userRoutes;
let journalRoutes;
let tagRoutes;

try {
    userRoutes = require("./routes/users");
} catch {
    userRoutes = null;
}
try {
    journalRoutes = require("./routes/journals");
} catch {
    journalRoutes = null;
}
try {
    tagRoutes = require("./routes/tags");
} catch {
    tagRoutes = null;
}

// NEW: Google OAuth routes
const googleOAuthRoutes = require("./routes/google_oauth");

// mount core routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);

if (userRoutes) {
    app.use("/api/users", userRoutes);
}

if (journalRoutes) {
    app.use("/api/journals", journalRoutes);
}

if (tagRoutes) {
    app.use("/api/tags", tagRoutes);
}

// Mount Google OAuth routes at root so they handle /oauth/google, /oauth/google/callback
app.use("/", googleOAuthRoutes);

// Simple health check
app.get("/", (req, res) => {
    res.json({ ok: true, message: "Travel Journal API is running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 8080;

/**
 * Start the server AFTER syncing ORM models.
 * This satisfies the "must use ORM" requirement while keeping
 * your existing sqlite3 routes working.
 */
async function startServer() {
    try {
        // Test the ORM connection
        await sequelize.authenticate();
        console.log("Sequelize connected to SQLite successfully.");

        // Sync ORM models. In dev, you can use { alter: true } to auto-update tables.
        await sequelize.sync();
        console.log("Sequelize models synchronized.");

        app.listen(PORT, () => {
            console.log(`API listening on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server with Sequelize:", err);
        process.exit(1);
    }
}

startServer();

module.exports = app;
