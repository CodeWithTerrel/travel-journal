// backend/src/middleware/requireUser.js

module.exports = function requireUser(req, res, next) {
    const id = req.cookies?.userId;
    if (!id) {
        return res.status(401).json({ message: "Login required" });
    }
    req.userId = Number(id);
    next();
};
