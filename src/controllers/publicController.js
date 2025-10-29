const pool = require('../db');

exports.getBanners = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT banner_name, banner_image, description FROM banners');
    return res.json({ status: 0, message: 'Sukses', data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.getServices = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT service_code, service_name, service_icon, service_tariff FROM services');
    return res.json({ status: 0, message: 'Sukses', data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};
