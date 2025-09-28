const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: Manajemen aktivitas/kegiatan siswa
 */

/**
 * @swagger
 * /activity/create:
 *   post:
 *     summary: Membuat aktivitas baru
 *     tags: [Activity]
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
 *                 example: Makan Siang
 *               description:
 *                 type: string
 *                 example: Siswa makan susu dan buah dari MBG (Semoga tidak keracunan)
 *     responses:
 *       201:
 *         description: Aktivitas berhasil dibuat
 *       403:
 *         description: Akses ditolak
 */
router.post(
  '/activity/create',
  protect,
  roleCheck('teacher', 'admin'),
  activityController.createActivity
);

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Melihat semua aktivitas
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar aktivitas
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/activity',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  activityController.getAllActivities
);

/**
 * @swagger
 * /activity/{id}:
 *   get:
 *     summary: Lihat aktivitas berdasarkan ID
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID aktivitas
 *     responses:
 *       200:
 *         description: Detail aktivitas
 *       404:
 *         description: Aktivitas tidak ditemukan
 */
router.get(
  '/activity/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  activityController.getActivityById
);

/**
 * @swagger
 * /activity/{id}:
 *   put:
 *     summary: Mengubah aktivitas
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID aktivitas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aktivitas berhasil diubah
 *       403:
 *         description: Akses ditolak
 */
router.put(
  '/activity/:id',
  protect,
  roleCheck('teacher', 'admin'),
  activityController.updateActivity
);

/**
 * @swagger
 * /activity/{id}:
 *   delete:
 *     summary: Menghapus aktivitas
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID aktivitas
 *     responses:
 *       200:
 *         description: Aktivitas berhasil dihapus
 *       403:
 *         description: Akses ditolak
 */
router.delete(
  '/activity/:id',
  protect,
  roleCheck('admin'),
  activityController.deleteActivity
);

module.exports = router;