// routes/message.routes.js
const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth.middleware');
const {
  getUserMessages,
  getMessageById,
  sendMessage,
  deleteMessage
} = require('../controllers/message.controller');

// GET all messages (hanya parent & teacher)
router.get(
  '/',
  protect,
  roleCheck('parent', 'teacher'),
  getUserMessages
);

// GET message by ID
router.get(
  '/send/message/:id',
  protect,
  roleCheck('parent', 'teacher'),
  getMessageById
);

// POST send message
router.post(
  '/send/message',
  protect,
  roleCheck('parent', 'teacher'),
  sendMessage
);

// DELETE message
router.delete(
  '/send/message/:id',
  protect,
  roleCheck('parent', 'teacher'),
  deleteMessage
);

module.exports = router;