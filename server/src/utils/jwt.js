const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

const refreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

module.exports = { 
  generateToken, 
  verifyToken, 
  decodeToken, 
  refreshToken 
};