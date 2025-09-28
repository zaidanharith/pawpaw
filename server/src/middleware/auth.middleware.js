const { verifyToken } = require('../utils/jwt');

const protect = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token tidak terdeteksi' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

const roleCheck = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.map(r => r.toLowerCase()).includes(req.user.role?.toLowerCase())) {
    return res.status(403).json({ message: 'Akses ditolak. Role tidak diizinkan' });
  }
  next();
};


module.exports = { protect, roleCheck };