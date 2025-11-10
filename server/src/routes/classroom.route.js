const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroom.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Classroom
 *   description: Manajemen data kelas dalam sistem
 */

/**
 * @swagger
 * /classroom:
 *   get:
 *     summary: Ambil semua data classroom
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kelas berhasil diambil
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/classroom/',
  protect,
  requireRole('PARENT', 'TEACHER', 'ADMIN'),
  classroomController.getAllClassrooms
);

/**
 * @swagger
 * /classroom/{id}:
 *   get:
 *     summary: Ambil data kelas berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kelas (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Detail kelas
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.get(
  '/classroom/:id',
  protect,
  requireRole('PARENT', 'TEACHER', 'ADMIN'),
  classroomController.getClassroomById
);

/**
 * @swagger
 * /classroom:
 *   post:
 *     summary: Buat data kelas baru
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacherId
 *             properties:
 *               name:
 *                 type: string
 *                 example: TK-A
 *               teacherId:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               activityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94"]
 *     responses:
 *       201:
 *         description: Kelas berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */
router.post(
  '/classroom',
  protect,
  requireRole('TEACHER', 'ADMIN'),
  classroomController.createClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   put:
 *     summary: Ubah data kelas berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID classroom (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TK-B"
 *               teacherId:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               activityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94", "64d4e8b1d165537831aeca95"]
 *     responses:
 *       200:
 *         description: Kelas berhasil diperbarui
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.put(
  '/classroom/:id',
  protect,
  requireRole('TEACHER', 'ADMIN'),
  classroomController.updateClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   delete:
 *     summary: Hapus data kelas berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kelas (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Kelas berhasil dihapus
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.delete(
  '/classroom/:id',
  protect,
  requireRole('ADMIN'),
  classroomController.deleteClassroom
);

module.exports = router;
