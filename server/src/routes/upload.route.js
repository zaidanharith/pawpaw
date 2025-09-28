const express = require('express');
const upload = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoint untuk upload file
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload file ke Cloudinary
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
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 file:
 *                   $ref: '#/components/schemas/Upload'
 *       400:
 *         description: Upload gagal
 */

router.post('/upload', upload.single('file'), uploadController.uploadFile);

module.exports = router;
