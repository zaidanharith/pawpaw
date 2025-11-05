const express = require("express");
const router = express.Router();
const quarterlyReportController = require("../controllers/quarterlyReport.controller");
const { protect, roleCheck } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Quarterly Report
 *   description: Manajemen laporan triwulan siswa
 */

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Ambil semua laporan triwulan
 *     tags: [Quarterly Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data laporan
 */
router.get(
  "/report",
  protect,
  roleCheck("ADMIN", "TEACHER"),
  quarterlyReportController.getQuarterlyReports
);

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Ambil laporan triwulan berdasarkan ID
 *     tags: [Quarterly Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID quarterly report
 *     responses:
 *       200:
 *         description: Data laporan ditemukan
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get(
  "/report/:id",
  protect,
  roleCheck("ADMIN", "TEACHER"),
  quarterlyReportController.getQuarterlyReportById
);

/**
 * @swagger
 * /report:
 *   post:
 *     summary: Tambah laporan triwulan baru untuk siswa
 *     tags: [Quarterly Report]
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
 *                 description: ID siswa
 *               teacherId:
 *                 type: string
 *                 description: ID guru yang membuat laporan
 *     responses:
 *       201:
 *         description: Quarterly report berhasil dibuat
 *       400:
 *         description: Laporan untuk kuartal ini sudah ada
 */
router.post(
  "/report",
  protect,
  roleCheck("TEACHER"),
  quarterlyReportController.generateQuarterlyReport
);

/**
 * @swagger
 * /report/{id}:
 *   delete:
 *     summary: Hapus laporan triwulan
 *     tags: [Quarterly Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID quarterly report
 *     responses:
 *       200:
 *         description: Laporan berhasil dihapus
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.delete(
  "/report/:id",
  protect,
  roleCheck("ADMIN", "TEACHER"),
  quarterlyReportController.deleteQuarterlyReport
);

module.exports = router;
