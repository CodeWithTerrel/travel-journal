const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/login", (req, res) => {
    const { email, password } = req.body || {};
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // simple session flag (no DB/JWT needed for this project)
        return res.json({ ok: true, role: "admin" });
    }
    return res.status(401).json({ ok: false, message: "Invalid login" });
});

module.exports = router;
