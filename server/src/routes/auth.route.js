const express = require('express');
const authController = require('../controllers/auth.controller');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', protect, adminOnly, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);

router.get('/profile', protect, authController.getProfile);

// router.get('/register', adminOnly, (req, res) => {
//     res.json({ message: 'agatha' });
// });

module.exports = router;