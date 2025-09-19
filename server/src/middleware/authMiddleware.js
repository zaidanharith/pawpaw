const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token tidak terdeteksi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

const adminOnly = (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };