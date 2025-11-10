const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Announcement
 *   description: Manajemen announcement untuk parent, teacher, dan admin
 */

/**
 * @swagger
 * /announcement/create:
 *   post:
 *     summary: Membuat pengumuman baru
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Jadwal Ujian Akhir Semester
 *               content:
 *                 type: string
 *                 example: UAS akan dilaksanakan mulai tanggal 5 Desember 2025
 *     responses:
 *       201:
 *         description: Pengumuman berhasil dibuat
 *       403:
 *         description: Akses ditolak
 */
router.post(
  '/announcement/create',
  protect,
  requireRole('TEACHER', 'ADMIN'),
  announcementController.createAnnouncement
);

/**
 * @swagger
 * /announcement:
 *   get:
 *     summary: Melihat semua pengumuman
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pengumuman
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/announcement',
  protect,
  requireRole('PARENT', 'TEACHER', 'ADMIN'),
  announcementController.getAnnouncements
);

/**
 * @swagger
 * /announcement/{id}:
 *   get:
 *     summary: Lihat pengumuman berdasarkan ID
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengumuman
 *     responses:
 *       200:
 *         description: Detail pengumuman
 *       404:
 *         description: Pengumuman tidak ditemukan
 */
router.get(
  '/announcement/:id',
  protect,
  requireRole('PARENT', 'TEACHER', 'ADMIN'),
  announcementController.getAnnouncementById
);

/**
 * @swagger
 * /announcement/{id}:
 *   put:
 *     summary: Mengubah pengumuman
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengumuman
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pengumuman berhasil diubah
 *       403:
 *         description: Akses ditolak
 */
router.put(
  '/announcement/:id',
  protect,
  requireRole('TEACHER', 'ADMIN'),
  announcementController.updateAnnouncement
);

/**
 * @swagger
 * /announcement/{id}:
 *   delete:
 *     summary: Menghapus pengumuman
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengumuman
 *     responses:
 *       200:
 *         description: Pengumuman berhasil dihapus
 *       403:
 *         description: Akses ditolak
 */
router.delete(
  '/announcement/:id',
  protect,
  requireRole('TEACHER', 'ADMIN'),
  announcementController.deleteAnnouncement
);

module.exports = router;
