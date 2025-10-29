const pool = require('../db');
const { generateInvoice } = require('../utils/invoice');

exports.getBalance = async (req, res) => {
  try {
    const email = req.user.email;
    const [rows] = await pool.execute('SELECT balance FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
    }
    return res.json({ status: 0, message: 'Get Balance Berhasil', data: { balance: Number(rows[0].balance) } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.topUp = async (req, res) => {
  try {
    const amount = req.body.top_up_amount;
    if (typeof amount !== 'number' && typeof amount !== 'string') {
      return res.status(400).json({ status: 102, message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0', data: null });
    }
    const topUpAmount = Number(amount);
    if (isNaN(topUpAmount) || topUpAmount < 0) {
      return res.status(400).json({ status: 102, message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0', data: null });
    }

    const email = req.user.email;
    // transaction: update users.balance and insert into transactions
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // get user
      const [urows] = await conn.execute('SELECT id, balance FROM users WHERE email = ? FOR UPDATE', [email]);
      if (urows.length === 0) {
        await conn.rollback();
        return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
      }
      const user = urows[0];
      const newBalance = Number(user.balance) + topUpAmount;
      await conn.execute('UPDATE users SET balance = ? WHERE id = ?', [newBalance, user.id]);
      const invoice = generateInvoice();
      await conn.execute('INSERT INTO transactions (invoice_number, user_id, transaction_type, description, total_amount) VALUES (?, ?, ?, ?, ?)', 
        [invoice, user.id, 'TOPUP', 'Top Up balance', topUpAmount]);
      await conn.commit();
      return res.json({ status: 0, message: 'Top Up Balance berhasil', data: { balance: newBalance } });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { service_code } = req.body;
    if (!service_code) {
      return res.status(400).json({ status: 102, message: 'Service ataus Layanan tidak ditemukan', data: null });
    }
    const email = req.user.email;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // get user
      const [urows] = await conn.execute('SELECT id, balance FROM users WHERE email = ? FOR UPDATE', [email]);
      if (urows.length === 0) {
        await conn.rollback();
        return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
      }
      const user = urows[0];
      // get service
      const [srows] = await conn.execute('SELECT service_code, service_name, service_tariff FROM services WHERE service_code = ?', [service_code]);
      if (srows.length === 0) {
        await conn.rollback();
        return res.status(400).json({ status: 102, message: 'Service ataus Layanan tidak ditemukan', data: null });
      }
      const service = srows[0];
      const total = Number(service.service_tariff);
      if (user.balance < total) {
        await conn.rollback();
        return res.status(400).json({ status: 102, message: 'Saldo tidak mencukupi', data: null });
      }
      const newBalance = Number(user.balance) - total;
      await conn.execute('UPDATE users SET balance = ? WHERE id = ?', [newBalance, user.id]);
      const invoice = generateInvoice();
      await conn.execute('INSERT INTO transactions (invoice_number, user_id, transaction_type, description, service_code, service_name, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [invoice, user.id, 'PAYMENT', service.service_name, service.service_code, service.service_name, total]);
      await conn.commit();
      return res.json({
        status: 0,
        message: 'Transaksi berhasil',
        data: {
          invoice_number: invoice,
          service_code: service.service_code,
          service_name: service.service_name,
          transaction_type: 'PAYMENT',
          total_amount: total,
          created_on: new Date().toISOString()
        }
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};

exports.transactionHistory = async (req, res) => {
  try {
    const email = req.user.email;
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    // find user id
    const [urows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (urows.length === 0) {
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
    }
    const userId = urows[0].id;
    let q = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC';
    const params = [userId];
    if (limit !== null) {
      q += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }
    const [rows] = await pool.execute(q, params);
    return res.json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset,
        limit: limit || rows.length,
        records: rows
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error', data: null });
  }
};
