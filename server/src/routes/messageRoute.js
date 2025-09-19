const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');

// GET "/" → dapatkan semua pesan user (parent/teacher)
router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher'),
    messageController.getUserMessages
);

// GET "/:id" → dapatkan detail pesan tertentu
router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher'),
    validateObjectId,
    messageController.getMessageById
);

// POST "/" → kirim pesan (parent ke teacher, atau teacher ke parent)
router.post(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher'),
    messageController.sendMessage
);

// (Opsional) DELETE "/:id" → hapus pesan (hanya pengirim/penerima)
router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher'),
    validateObjectId,
    messageController.deleteMessage
);

module.exports = router;