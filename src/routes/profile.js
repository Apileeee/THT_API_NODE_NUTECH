const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile/update', authMiddleware, profileController.updateProfile);
router.put('/profile/image', authMiddleware, upload.single('file'), profileController.uploadProfileImage);

module.exports = router;
