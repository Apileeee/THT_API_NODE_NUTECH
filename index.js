// index.js
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads static
app.use(`/${process.env.UPLOAD_DIR || 'uploads'}`, express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// routes
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const publicRoutes = require('./src/routes/public');
const transactionRoutes = require('./src/routes/transaction');

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', publicRoutes);
app.use('/', transactionRoutes);

// health
app.get('/', (req, res) => res.json({ status: 0, message: 'API running', data: null }));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
