const express = require("express");
const router = express.Router();
const liveReportController = require("../controllers/liveReport.controller");
const { protect, roleCheck } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: Live Report
 *   description: API untuk mengelola live report kegiatan anak
 */

/**
 * @swagger
 * /api/livereport:
 *   get:
 *     summary: Ambil semua live report
 *     tags: [Live Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua live report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Live reports retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/LiveReport"
 *       500:
 *         description: Server error
 */
router.get(
  "/livereport",
  protect,
  roleCheck("parent", "teacher", "admin"),
  liveReportController.getAllLiveReports
);

/**
 * @swagger
 * /api/livereport/{id}:
 *   get:
 *     summary: Ambil detail live report berdasarkan ID
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
 *         description: Berhasil mengambil detail live report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Live report retrieved successfully"
 *                 data:
 *                   $ref: "#/components/schemas/LiveReport"
 *       404:
 *         description: Live report tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  "/livereport/:id",
  protect,
  roleCheck("parent", "teacher", "admin"),
  liveReportController.getLiveReportById
);

/**
 * @swagger
 * /api/livereport/create:
 *   post:
 *     summary: Tambah live report baru
 *     tags: [LiveReport]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul kegiatan (Wajib)
 *                 example: "Eksperimen Sains"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal kegiatan (format YYYY-MM-DD)
 *                 example: "2025-09-27"
 *               description:
 *                 type: string
 *                 description: Deskripsi kegiatan
 *                 example: "Anak-anak membuat gunung berapi mini"
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto kegiatan (opsional)
 *     responses:
 *       201:
 *         description: Live report berhasil dibuat
 *       400:
 *         description: Data tidak valid
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */
router.post(
  "/livereport/create",
  protect,
  roleCheck("teacher", "admin"),
  upload.single("photo"),
  liveReportController.createLiveReport
);

/**
 * @swagger
 * /api/livereport/{id}:
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
 *         description: ID live report yang akan diupdate
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul kegiatan baru
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal kegiatan baru (YYYY-MM-DD)
 *               description:
 *                 type: string
 *                 description: Deskripsi kegiatan baru
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto kegiatan baru (opsional)
 *     responses:
 *       200:
 *         description: Live report berhasil diupdate
 *       404:
 *         description: Live report tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put(
  "/livereport/:id",
  protect,
  roleCheck("teacher", "admin"),
  upload.single("photo"),
  liveReportController.updateLiveReport
);

/**
 * @swagger
 * /api/livereport/{id}:
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
 *         description: ID live report yang akan dihapus
 *     responses:
 *       200:
 *         description: Live report berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Live report deleted successfully"
 *       404:
 *         description: Live report tidak ditemukan
 */
router.delete(
  "/livereport/:id",
  protect,
  roleCheck("teacher", "admin"),
  liveReportController.deleteLiveReport
);

module.exports = router;