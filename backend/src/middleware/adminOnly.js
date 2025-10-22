// For the course scope we accept a simple header flag from frontend after login.
// In real apps use proper sessions/JWT.
function adminOnly(req, res, next) {
    if (req.headers["x-admin"] === "true") return next();
    return res.status(401).json({ message: "Admin only" });
}
module.exports = adminOnly;
