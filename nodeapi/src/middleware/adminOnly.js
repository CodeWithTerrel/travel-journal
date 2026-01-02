// backend/src/middleware/adminOnly.js
module.exports = function adminOnly(req, res, next) {
    const cookies = req.cookies || {};

    const role = cookies.role;
    const isAdminCookie = cookies.admin === "1";

    const isAdmin = role === "admin" || isAdminCookie;

    if (!isAdmin) {
        return res.status(403).json({ message: "Admin only" });
    }

    next();
};
