const express = require('express');
const router = express.Router();
const quarterlyReportController = require('../controllers/quarterlyReport.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: QuarterlyReports
 *   description: Manajemen laporan triwulanan siswa
 */

/**
 * @swagger
 * /quarterly-reports:
 *   get:
 *     summary: Ambil semua quarterly reports
 *     tags: [QuarterlyReports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data laporan
 */
router.get('/quarterly-reports', protect, roleCheck('admin', 'teacher'), quarterlyReportController.getQuarterlyReports);

/**
 * @swagger
 * /quarterly-reports/{id}:
 *   get:
 *     summary: Ambil quarterly report berdasarkan ID
 *     tags: [QuarterlyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data laporan ditemukan
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get('/quarterly-reports/:id', protect, roleCheck('admin', 'teacher'), quarterlyReportController.getQuarterlyReportById);

/**
 * @swagger
 * /quarterly-reports:
 *   post:
 *     summary: Generate quarterly report baru untuk siswa
 *     tags: [QuarterlyReports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - teacherId
 *             properties:
 *               studentId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quarterly report berhasil dibuat
 *       400:
 *         description: Laporan untuk kuartal ini sudah ada
 */
router.post('/quarterly-reports', protect, roleCheck('teacher'), quarterlyReportController.generateQuarterlyReport);

/**
 * @swagger
 * /quarterly-reports/{id}:
 *   delete:
 *     summary: Hapus quarterly report
 *     tags: [QuarterlyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Laporan berhasil dihapus
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.delete('/quarterly-reports/:id', protect, roleCheck('admin', 'teacher'), quarterlyReportController.deleteQuarterlyReport);

module.exports = router;