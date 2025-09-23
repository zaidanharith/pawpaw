const express = require('express');
const authController = require('../controllers/auth.controller');

const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', protect, adminOnly, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);

router.get('/profile', protect, authController.getProfile);

module.exports = router;