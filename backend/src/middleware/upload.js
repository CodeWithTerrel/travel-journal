const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Invalid file type. Only JPG/PNG/WEBP allowed."));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 } // 5MB each, up to 5 files
});

// Helper to remove an array of uploaded files on error
function cleanupFiles(files) {
    if (!files) return;
    const list = Array.isArray(files) ? files : [files];
    for (const f of list) {
        try { fs.unlinkSync(f.path); } catch {}
    }
}

module.exports = { upload, cleanupFiles, UPLOAD_DIR };
