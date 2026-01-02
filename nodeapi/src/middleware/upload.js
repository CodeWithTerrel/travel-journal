// backend/src/middleware/upload.js
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Save files in backend/uploads (one shared folder)
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, base + ext);
    },
});

// basic validation (JPG/PNG/WEBP only)
function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only JPG/PNG/WEBP files are allowed"));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// helper to delete file on validation/DB errors
function cleanupFiles(file) {
    if (!file) return;
    try {
        fs.unlinkSync(file.path);
    } catch {
        // ignore
    }
}

module.exports = { upload, cleanupFiles };
