// middleware/roleCheck.js
module.exports = function(allowedRoles) {
    return (req, res, next) => {
        // Memastikan user sudah login 
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please login" });
        }

        // Cek apakah role user diizinkan
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: insufficient role" });
        }

        // Lanjut ke controller
        next();
    };
};