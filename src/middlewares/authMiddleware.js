const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
  }
  const token = parts[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
  }
}

module.exports = authMiddleware;
