const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Manajemen sistem pesan antara orang tua dan guru
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Melihat semua pesan milik user yang sedang login
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pesan user yang berhasil diambil
 *       401:
 *         description: Akses ditolak
 */
router.get(
  '/',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.getUserMessages
);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Meihat detail pesan berdasarkan ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID pesan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail pesan berhasil diambil
 *       404:
 *         description: Pesan tidak ditemukan
 */
router.get(
  '/messages/:id',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.getMessageById
);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Mengirim pesan baru
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID penerima pesan
 *               content:
 *                 type: string
 *                 description: Isi pesan
 *     responses:
 *       201:
 *         description: Pesan berhasil dikirim
 *       400:
 *         description: Bad request
 */
router.post(
  '/messages',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.sendMessage
);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Menghapus pesan berdasarkan ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID pesan yang akan dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pesan berhasil dihapus
 *       404:
 *         description: Pesan tidak ditemukan
 */
router.delete(
  '/messages/:id',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.deleteMessage
);

module.exports = router;