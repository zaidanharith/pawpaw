const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: Manajemen aktivitas untuk user (parent, teacher, admin)
 */

/**
 * @swagger
 * /activity/create:
 *   post:
 *     summary: Buat aktivitas baru
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
 *                 example: Belajar Matematika
 *               description:
 *                 type: string
 *                 example: Aktivitas latihan penjumlahan
 *     responses:
 *       201:
 *         description: Aktivitas berhasil dibuat
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
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
 *     summary: Ambil semua aktivitas
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
 *     summary: Ambil aktivitas berdasarkan ID
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
 *     summary: Update aktivitas
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
 *         description: Aktivitas berhasil diperbarui
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
 *     summary: Hapus aktivitas
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
 *         description: Akses ditolak (bukan admin)
 */
router.delete(
  '/activity/:id',
  protect,
  roleCheck('admin'),
  activityController.deleteActivity
);

module.exports = router;