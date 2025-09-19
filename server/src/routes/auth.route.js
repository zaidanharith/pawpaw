const express = require('express');
const authController = require('../controllers/auth.controller');

const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);

router.get('/profile', authMiddleware, authController.getProfile);

router.get('/register', adminOnly, (req, res) => {
    res.json({ message: 'agatha' });
});

module.exports = router;