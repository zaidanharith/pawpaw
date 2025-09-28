const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReportController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

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
 *     summary: Ambil semua live report
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua live report
 */

router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    liveReportController.getAllLiveReports
);

/**
 * @swagger
 * /livereport/{id}:
 *   get:
 *     summary: Ambil live report berdasarkan ID
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
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    liveReportController.getLiveReportById
);

/**
 * @swagger
 * /livereport:
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
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6512bc2c14aaf1e33b5b45cd"]
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
    '/',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    upload.single('photo'), // field foto bernama 'photo'
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
 *                 type: array
 *                 items:
 *                   type: string
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
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
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
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    liveReportController.deleteLiveReport
);

module.exports = router;