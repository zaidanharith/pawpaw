const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReport.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// GET "/" → getAllLiveReports, bisa diakses parent, teacher, admin
router.get(
  '/livereport',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  /**
   * @swagger
   * /api/livereport:
   *   get:
   *     summary: Ambil semua live report
   *     tags: [LiveReport]
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
   *                     $ref: '#/components/schemas/LiveReport'
   *       401:
   *         description: Tidak terautentikasi
   *       403:
   *         description: Akses ditolak
   *       500:
   *         description: Server error
   */
  liveReportController.getAllLiveReports
);

// GET "/:id" → getLiveReportById, bisa diakses parent, teacher, admin
router.get(
  '/livereport/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
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
   *                   $ref: '#/components/schemas/LiveReport'
   *       400:
   *         description: Format ID tidak valid
   *       401:
   *         description: Tidak terautentikasi
   *       403:
   *         description: Akses ditolak
   *       404:
   *         description: Live report tidak ditemukan
   *       500:
   *         description: Server error
   */
  liveReportController.getLiveReportById
);

// POST "/" → createLiveReport, hanya teacher & admin, dengan upload foto
router.post(
  '/livereport/create',
  protect,
  roleCheck('teacher', 'admin'),
  upload.single('photo'),
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
   *               - activity
   *               - date
   *             properties:
   *               activity:
   *                 type: string
   *                 description: ID activity (wajib)
   *                 example: "68d7da4c93bb4e1c51cc6a5b"
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Tanggal kegiatan (wajib) - format YYYY-MM-DD
   *                 example: "2025-09-27"
   *               description:
   *                 type: string
   *                 description: Deskripsi kegiatan
   *                 example: "Siswa aktif mengikuti pelajaran"
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: Foto kegiatan (opsional)
   *     responses:
   *       201:
   *         description: Live report berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Live report created successfully"
   *                 data:
   *                   $ref: '#/components/schemas/LiveReport'
   *       400:
   *         description: Data tidak valid atau activity tidak ditemukan
   *       401:
   *         description: Tidak terautentikasi
   *       403:
   *         description: Akses ditolak (bukan teacher/admin)
   *       500:
   *         description: Server error
   */
  liveReportController.createLiveReport
);

// PUT "/:id" → updateLiveReport, hanya teacher & admin, dengan upload foto
router.put(
  '/livereport/:id',
  protect,
  roleCheck('teacher', 'admin'),
  upload.single('photo'),
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
   *               activity:
   *                 type: string
   *                 description: ID activity
   *                 example: "68d7da4c93bb4e1c51cc6a5b"
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Tanggal kegiatan - format YYYY-MM-DD
   *                 example: "2025-09-27"
   *               description:
   *                 type: string
   *                 description: Deskripsi kegiatan
   *                 example: "Siswa aktif mengikuti pelajaran"
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: Foto kegiatan baru (opsional)
   *     responses:
   *       200:
   *         description: Live report berhasil diupdate
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Live report updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/LiveReport'
   *       400:
   *         description: Data tidak valid
   *       401:
   *         description: Tidak terautentikasi
   *       403:
   *         description: Akses ditolak atau tidak authorized
   *       404:
   *         description: Live report tidak ditemukan
   *       500:
   *         description: Server error
   */
  liveReportController.updateLiveReport
);

// DELETE "/:id" → deleteLiveReport, hanya teacher & admin
router.delete(
  '/livereport/:id',
  protect,
  roleCheck('teacher', 'admin'),
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
   *       401:
   *         description: Tidak terautentikasi
   *       403:
   *         description: Akses ditolak atau tidak authorized
   *       404:
   *         description: Live report tidak ditemukan
   *       500:
   *         description: Server error
   */
  liveReportController.deleteLiveReport
);

module.exports = router;