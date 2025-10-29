const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtHours = parseInt(process.env.JWT_EXPIRES_HOURS || '12');

exports.registerValidation = [
  body('email').isEmail().withMessage('Paramter email tidak sesuai format'),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // map to one error
    const err = errors.array()[0];
    return res.status(400).json({ status: 102, message: err.msg, data: null });
  }

  const { email, first_name, last_name, password } = req.body;
  try {
    // check if exists
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ status: 102, message: 'Email sudah terdaftar', data: null });
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashed, first_name || null, last_name || null]
    );
    return res.json({ status: 0, message: 'Registrasi berhasil silahkan login', data: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.loginValidation = [
  body('email').isEmail().withMessage('Paramter email tidak sesuai format'),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array()[0];
    return res.status(400).json({ status: 102, message: err.msg, data: null });
  }

  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT id, password FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }
    // generate token with payload email
    const payload = { email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: `${jwtHours}h` });
    return res.json({ status: 0, message: 'Login Sukses', data: { token } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};
