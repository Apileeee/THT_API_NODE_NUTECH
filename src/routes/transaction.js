const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transactionController');

router.get('/balance', authMiddleware, transactionController.getBalance);
router.post('/topup', authMiddleware, transactionController.topUp);
router.post('/transaction', authMiddleware, transactionController.createTransaction);
router.get('/transaction/history', authMiddleware, transactionController.transactionHistory);

module.exports = router;
