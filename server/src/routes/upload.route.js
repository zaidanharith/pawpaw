const express = require('express');
const upload = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Manajeman unggah (upload) file ke Cloudinary
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Mengunggah file ke Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File berhasil diunggah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File berhasil diunggah
 *                 status:
 *                   type: string
 *                 file:
 *                   $ref: '#/components/schemas/Upload'
 *       400:
 *         description: Upload gagal
 */

router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
