const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { protect, roleCheck } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Manajemen data siswa
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       403:
 *         description: Akses ditolak
 */
router.get(
  "/student",
  protect,
  roleCheck("PARENT", "TEACHER", "ADMIN"),
  studentController.getAllStudents
);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Siswa tidak ditemukan
 */
router.get(
  "/student/:id",
  protect,
  roleCheck("PARENT", "TEACHER", "ADMIN"),
  studentController.getStudentById
);

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
 *             $ref: '#/components/schemas/Student'
 *           example:
 *             name: Agatha
 *             age: 10
 *             classroomId: 64b5f72a9c9f2a001c23a8f5
 *     responses:
 *       201:
 *         description: Siswa berhasil ditambahkan
 *       403:
 *         description: Akses ditolak (bukan teacher/admin)
 */
router.post(
  "/student/create",
  protect,
  roleCheck("TEACHER", "ADMIN"),
  studentController.createStudent
);

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
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Data siswa berhasil diperbarui
 *       403:
 *         description: Akses ditolak
 */
router.put(
  "/student/:id",
  protect,
  roleCheck("TEACHER", "ADMIN"),
  studentController.updateStudent
);

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
  "/student/:id",
  protect,
  roleCheck("TEACHER", "ADMIN"),
  studentController.deleteStudent
);

module.exports = router;