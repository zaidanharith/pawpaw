const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReport.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: LiveReport
 *   description: Manajemen laporan kegiatan siswa (live report)
 */

/**
 * @swagger
 * /livereport:
 *   get:
 *     summary: Ambil semua data live report
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua live report
 */

router.get(
    '/livereport',
    protect,
    roleCheck('parent', 'teacher', 'admin'),
    liveReportController.getAllLiveReports
);

/**
 * @swagger
 * /livereport/{id}:
 *   get:
 *     summary: Ambil data live report berdasarkan ID
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID live report
 *     responses:
 *       200:
 *         description: Detail live report
 *       404:
 *         description: Live report tidak ditemukan
 */

router.get(
    '/livereport/:id',
    protect,
    roleCheck('parent', 'teacher', 'admin'),
    liveReportController.getLiveReportById
);

/**
 * @swagger
 * /livereport/create:
 *   post:
 *     summary: Buat live report baru
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Senam Pagi"
 *               description:
 *                 type: string
 *                 example: "Siswa melakukan senam pagi di halaman sekolah"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-28"
 *               activity:
 *                 type: string
 *                 example: "68d92364591af78e97dcd366"
 *               classroom:
 *                 type: string
 *                 example: "68d95174b9347010789e01a2"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Live report berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */

router.post(
    '/livereport/create',
    protect,
    roleCheck('teacher', 'admin'),
    upload.single('photo'), 
    liveReportController.createLiveReport
);

/**
 * @swagger
 * /livereport/{id}:
 *   put:
 *     summary: Update live report
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 68d9ab6dac3e9ec6fb0d449a
 *         schema:
 *           type: string
 *         required: true
 *         description: ID live report
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Senam Pagi Update"
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               activity:
 *                 type: string
 *                 example: "68d92364591af78e97dcd366"
 *               classroom:
 *                 type: string
 *                 example: "68d95174b9347010789e01a2"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Live report berhasil diperbarui
 *       404:
 *         description: Live report tidak ditemukan
 */

router.put(
    '/livereport/:id',
    protect,
    roleCheck('teacher', 'admin'),
    upload.single('photo'),
    liveReportController.updateLiveReport
);

/**
 * @swagger
 * /livereport/{id}:
 *   delete:
 *     summary: Hapus live report
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID live report
 *     responses:
 *       200:
 *         description: Live report berhasil dihapus
 *       404:
 *         description: Live report tidak ditemukan
 */

router.delete(
    '/livereport/:id',
    protect,
    roleCheck('teacher', 'admin'),
    liveReportController.deleteLiveReport
);

module.exports = router;