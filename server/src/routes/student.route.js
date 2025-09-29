const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nama siswa
 *         age:
 *           type: number
 *           description: Umur siswa
 *         classroomId:
 *           type: string
 *           description: ID kelas siswa
 */

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Manajemen data siswa
 */

// POST /student/create
/**
 * @swagger
 * /student/create:
 *   post:
 *     summary: Menambah siswa baru
 *     tags: [Student]
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
 *                 example: Agatha
 *               age:
 *                 type: number
 *                 example: 10
 *               classroomId:
 *                 type: string
 *                 example: 64b5f72a9c9f2a001c23a8f5
 *     responses:
 *       201:
 *         description: Siswa berhasil ditambahkan
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */
router.post(
  '/student/create',
  protect,
  roleCheck('teacher', 'admin'),
  studentController.createStudent
);

// GET /student
/**
 * @swagger
 * /student:
 *   get:
 *     summary: Ambil semua siswa
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar siswa
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/student',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  studentController.getAllStudents
);

// GET /student/{id}
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Ambil detail siswa berdasarkan ID
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID siswa
 *     responses:
 *       200:
 *         description: Detail siswa
 *       404:
 *         description: Siswa tidak ditemukan
 */
router.get(
  '/student/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  studentController.getStudentById
);

router.put(
  '/student/:id',
  protect,
  roleCheck('teacher', 'admin'),
  /**

   * @swagger
   * /student/{id}:
   *   put:
   *     summary: Update data siswa
   *     tags: [Student]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID siswa
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               age:
   *                 type: number
   *               classroomId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Data siswa berhasil diperbarui
   *       403:
   *         description: Akses ditolak
   */

  studentController.updateStudent
);

router.delete(
  '/student/:id',
  protect,
  roleCheck('teacher', 'admin'),
  studentController.updateStudent
);

// DELETE /student/{id}
/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Hapus siswa
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID siswa
 *     responses:
 *       200:
 *         description: Siswa berhasil dihapus
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */
router.delete(
  '/student/:id',
  protect,
  roleCheck('teacher', 'admin'),
  studentController.deleteStudent
);

module.exports = router;