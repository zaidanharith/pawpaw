// routes/quarterlyReport.routes.js

const express = require("express");
const router = express.Router();
const quarterlyReportController = require("../controllers/quarterlyReport.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: QuarterlyReport
 *   description: Manajemen laporan triwulan
 */

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Lihat semua laporan triwulan
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar laporan triwulan
 *       403:
 *         description: Akses ditolak
 */
router.get(
  "/report",
  protect,
  requireRole("ADMIN", "TEACHER", "PARENT"),
  quarterlyReportController.getQuarterlyReports
);

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Lihat laporan triwulan berdasarkan ID
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID laporan
 *     responses:
 *       200:
 *         description: Detail laporan
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get(
  "/report/:id",
  protect,
  requireRole("ADMIN", "TEACHER"),
  quarterlyReportController.getQuarterlyReportById
);

/**
 * @swagger
 * /report:
 *   post:
 *     summary: Buat laporan triwulan baru (otomatis berdasarkan 90 hari terakhir)
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Rekap Kegiatan Q1 2025
 *               meetingDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-03-31T10:00:00.000Z
 *     responses:
 *       201:
 *         description: Laporan berhasil dibuat
 *       400:
 *         description: Duplikat atau input tidak valid
 */
router.post(
  "/report",
  protect,
  requireRole("ADMIN", "TEACHER"),
  quarterlyReportController.generateQuarterlyReport
);

/**
 * @swagger
 * /report/{id}:
 *   put:
 *     summary: Perbarui laporan triwulan
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID laporan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               meetingDate:
 *                 type: string
 *                 format: date-time
 *               activitiesSummary:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Laporan berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 */
router.put(
  "/report/:id",
  protect,
  requireRole("ADMIN", "TEACHER"),
  quarterlyReportController.updateQuarterlyReport
);

/**
 * @swagger
 * /report/{id}:
 *   delete:
 *     summary: Hapus laporan triwulan
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID laporan
 *     responses:
 *       200:
 *         description: Laporan berhasil dihapus
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.delete(
  "/report/:id",
  protect,
  requireRole("ADMIN", "TEACHER"),
  quarterlyReportController.deleteQuarterlyReport
);

/**
 * @swagger
 * /report/{id}/pdf:
 *   get:
 *     summary: Unduh laporan triwulan dalam format PDF
 *     tags: [QuarterlyReport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID laporan
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Laporan tidak ditemukan
 */
router.get(
  "/report/:id/pdf",
  protect,
  requireRole("ADMIN", "TEACHER", "PARENT"),
  quarterlyReportController.downloadQuarterlyReportPdf
);

module.exports = router;