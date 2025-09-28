const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API untuk sistem pesan antara orang tua dan guru
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Ambil semua pesan milik user yang sedang login
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pesan user yang berhasil diambil
 *       401:
 *         description: Tidak memiliki otorisasi
 */
router.get(
  '/message',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.getUserMessages
);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Ambil detail pesan berdasarkan ID
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
  '/message/:id',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.getMessageById
);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Kirim pesan baru
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
 *         description: Permintaan tidak valid
 */
router.post(
  '/send/message',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.sendMessage
);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Hapus pesan berdasarkan ID
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
  '/message/:id',
  protect,
  roleCheck('parent', 'teacher'),
  messageController.deleteMessage
);

module.exports = router;