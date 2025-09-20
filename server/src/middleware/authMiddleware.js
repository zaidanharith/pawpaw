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

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan' });
  }
  next();
};

module.exports = { protect, adminOnly };