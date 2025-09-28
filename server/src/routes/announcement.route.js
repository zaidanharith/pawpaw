const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth.middleware');

const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcement.controller');

/**
 * @swagger
 * tags:
 *   name: Announcement
 *   description: Manajemen pengumuman untuk parent, teacher, dan admin
 */

/**
 * @swagger
 * /announcement/create:
 *   post:
 *     summary: Buat pengumuman baru
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
 *                 example: Libur Sekolah
 *               content:
 *                 type: string
 *                 example: Sekolah akan libur mulai tanggal 1 Mei sampai 5 Mei.
 *     responses:
 *       201:
 *         description: Pengumuman berhasil dibuat
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */

router.post(
  '/announcement/create',
  protect,
  roleCheck('teacher', 'admin'),
  createAnnouncement
);

/**
 * @swagger
 * /announcement:
 *   get:
 *     summary: Ambil semua pengumuman
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
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncements
);

/**
 * @swagger
 * /announcement/{id}:
 *   get:
 *     summary: Ambil pengumuman berdasarkan ID
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
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncementById
);

/**
 * @swagger
 * /announcement/{id}:
 *   put:
 *     summary: Update pengumuman
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
 *                 example: Perubahan Jadwal Ujian
 *               content:
 *                 type: string
 *                 example: Jadwal ujian diundur ke minggu depan.
 *     responses:
 *       200:
 *         description: Pengumuman berhasil diperbarui
 *       403:
 *         description: Akses ditolak
 */

router.put(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  updateAnnouncement
);

/**
 * @swagger
 * /announcement/{id}:
 *   delete:
 *     summary: Hapus pengumuman
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
 *         description: Akses ditolak (bukan teacher/admin)
 */

router.delete(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  deleteAnnouncement
);

module.exports = router;
