const pool = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const [rows] = await pool.execute('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
    }
    return res.json({ status: 0, message: 'Sukses', data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { first_name, last_name } = req.body;
    await pool.execute('UPDATE users SET first_name = ?, last_name = ? WHERE email = ?', [first_name || null, last_name || null, email]);
    const [rows] = await pool.execute('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    return res.json({ status: 0, message: 'Update Pofile berhasil', data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 102, message: 'Format Image tidak sesuai', data: null });
    }
    const email = req.user.email;
    // build accessible URL — assuming BASE_URL dari .env
    const base = process.env.BASE_URL || '';
    const fileUrl = `${base}/${process.env.UPLOAD_DIR || 'uploads'}/${req.file.filename}`;
    await pool.execute('UPDATE users SET profile_image = ? WHERE email = ?', [fileUrl, email]);
    const [rows] = await pool.execute('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [email]);
    return res.json({ status: 0, message: 'Update Profile Image berhasil', data: rows[0] });
  } catch (err) {
    if (err.message === 'FORMAT_NOT_ALLOWED') {
      return res.status(400).json({ status: 102, message: 'Format Image tidak sesuai', data: null });
    }
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};
