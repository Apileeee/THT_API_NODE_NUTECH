const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/banner', publicController.getBanners);
// services is private per spec: "API Services Private (memerlukan Token)"
router.get('/services', authMiddleware, publicController.getServices);

module.exports = router;
