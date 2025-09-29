const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: Manajemen data aktivitas/kegiatan siswa
 */

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Lihat semua data aktivitas
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
 *     summary: Lihat data aktivitas berdasarkan ID
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
 * /activity/create:
 *   post:
 *     summary: Tambah data aktivitas baru
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
 *               name:
 *                 type: string
 *                 example: Makan Siang
 *               description:
 *                 type: string
 *                 example: Siswa makan susu dan buah dari MBG (Semoga tidak keracunan)
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4967d0d8992e610c85
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
 * /activity/{id}:
 *   put:
 *     summary: Ubah data aktivitas
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
 *               name:
 *                 type: string
 *                 example: Bermain
 *               description:
 *                 type: string
 *                 example: Siswa bermain di taman
 *               student: 
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 60d21b4967d0d8992e610c85
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
 *     summary: Hapus data aktivitas
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