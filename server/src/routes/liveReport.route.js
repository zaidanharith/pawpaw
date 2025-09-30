const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReport.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Live Report
 *   description: Manajemen laporan kegiatan harian
 */

/**
 * @swagger
 * /livereport:
 *   get:
 *     summary: Ambil semua Live Report
 *     tags: [Live Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar Live Report berhasil diambil
 *       403:
 *         description: Akses ditolak
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
 *     summary: Ambil Live Report berdasarkan ID
 *     tags: [Live Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Live Report
 *     responses:
 *       200:
 *         description: Detail Live Report
 *       404:
 *         description: Live Report tidak ditemukan
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
 *     summary: Buat Live Report baru
 *     tags: [Live Report]
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
 *                 example: "Laporan Hari Pertama"
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94"]
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-26"
 *               teacher:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               description:
 *                 type: string
 *                 example: "Hari ini anak-anak belajar mengenal angka"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Live Report berhasil dibuat
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
 *     summary: Ubah Live Report berdasarkan ID
 *     tags: [Live Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Live Report
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Laporan Hari Kedua"
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94"]
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-27"
 *               teacher:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               description:
 *                 type: string
 *                 example: "Hari ini anak-anak bermain peran"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Live Report berhasil diperbarui
 *       404:
 *         description: Live Report tidak ditemukan
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
 *     summary: Hapus Live Report berdasarkan ID
 *     tags: [Live Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Live Report
 *     responses:
 *       200:
 *         description: Live Report berhasil dihapus
 *       404:
 *         description: Live Report tidak ditemukan
 */
router.delete(
  '/livereport/:id',
  protect,
  roleCheck('teacher', 'admin'),
  liveReportController.deleteLiveReport
);

module.exports = router;
