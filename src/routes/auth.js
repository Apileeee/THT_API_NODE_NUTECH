const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registration', authController.registerValidation, authController.register);
router.post('/login', authController.loginValidation, authController.login);

module.exports = router;
