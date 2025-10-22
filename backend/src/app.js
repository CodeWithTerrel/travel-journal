const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());                // allow frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically (so React can show images)
const { UPLOAD_DIR } = require("./middleware/upload");
app.use("/uploads", express.static(UPLOAD_DIR));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/destinations", require("./routes/destinations"));
app.use("/api/entries", require("./routes/entries"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
