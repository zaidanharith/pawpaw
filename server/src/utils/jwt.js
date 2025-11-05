const jwt = require('jsonwebtoken');

const generateToken = (userId, username, role) => {
  return jwt.sign(
    { 
      id: userId,
      username, 
      role 
    },
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Token tidak valid');
  }
};

module.exports = { 
  generateToken, 
  verifyToken
};