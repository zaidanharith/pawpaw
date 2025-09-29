const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Manajemen data kehadiran siswa
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Lihat semua data kehadiran siswa
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semua data kehadiran siswa
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/attendance',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.getAllAttendances
);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Ambil data kehadiran berdasarkan ID
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID data kehadiran
 *     responses:
 *       200:
 *         description: Detail data kehadiran
 *       404:
 *         description: Data kehadiran tidak ditemukan
 */
router.get(
  '/attendance/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  attendanceController.getAttendanceById
);

/**
 * @swagger
 * /attendance/create:
 *   post:
 *     summary: Buat data kehadiran baru
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student:
 *                 type: string
 *                 example: 68d4e8b1d1655378313aeca9
 *               status:
 *                 type: string
 *                 enum: [Hadir, Alfa, Sakit, Izin]
 *                 example: Hadir
 *               notes:
 *                 type: string
 *                 example: Masuk tepat waktu
 *     responses:
 *       201:
 *         description: Data kehadiran berhasil dibuat
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */
router.post(
  '/attendance/create',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.createAttendance
);

/**
 * @swagger
 * /attendance/student/{studentId}:
 *   get:
 *     summary: Lihat data kehadiran berdasarkan Student ID
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID student
 *     responses:
 *       200:
 *         description: Daftar kehadiran siswa
 *       404:
 *         description: Data kehadiran tidak ditemukan
 */
router.get(
  '/attendance/student/:studentId',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  attendanceController.getAttendanceByStudent
);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Ubah data kehadiran
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID data kehadiran
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Hadir, Alfa, Sakit, Izin]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data kehadiran berhasil diperbarui
 *       404:
 *         description: Data kehadiran tidak ditemukan
 */
router.put(
  '/attendance/:id',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.updateAttendance
);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Hapus data kehadiran  
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID data kehadiran
 *     responses:
 *       200:
 *         description: Data kehadiran berhasil dihapus
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.delete(
  '/attendance/:id',
  protect,
  roleCheck('admin', 'teacher'),
  attendanceController.deleteAttendance
);

module.exports = router;
