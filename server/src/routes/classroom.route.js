const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Classroom
 *   description: Manajemen data kelas
 */

/**
 * @swagger
 * /classroom:
 *   get:
 *     summary: Ambil semua kelas
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua kelas
 *       403:
 *         description: Akses ditolak
 */
router.get(
  '/classroom',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  classroomController.getAllClassrooms
);

/**
 * @swagger
 * /classroom/{id}:
 *   get:
 *     summary: Ambil detail kelas berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kelas
 *     responses:
 *       200:
 *         description: Detail kelas
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.get(
  '/classroom/:id',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  validateObjectId,
  classroomController.getClassroomById
);

/**
 * @swagger
 * /classroom:
 *   post:
 *     summary: Tambah kelas baru
 *     tags: [Classroom]
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
 *                 example: TK A
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["651f2d9a8e7b3c00123abc11", "651f2d9a8e7b3c00123abc12"]
 *               teacher:
 *                 type: string
 *                 example: 651f2d9a8e7b3c00123abc99
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["651f2d9a8e7b3c00123abd01", "651f2d9a8e7b3c00123abd02"]
 *     responses:
 *       201:
 *         description: Kelas berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
router.post(
  '/create/classrooms',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  classroomController.createClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   put:
 *     summary: Update data kelas
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kelas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: TK B
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["651f2d9a8e7b3c00123abc13"]
 *               teacher:
 *                 type: string
 *                 example: 651f2d9a8e7b3c00123abc77
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["651f2d9a8e7b3c00123abd05"]
 *     responses:
 *       200:
 *         description: Data kelas berhasil diperbarui
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.put(
  '/classroom/:id',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  validateObjectId,
  classroomController.updateClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   delete:
 *     summary: Hapus kelas
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kelas
 *     responses:
 *       200:
 *         description: Kelas berhasil dihapus
 *       404:
 *         description: Kelas tidak ditemukan
 */
router.delete(
  '/classroom/:id',
  authMiddleware,
  authorizeRole('admin'),
  validateObjectId,
  classroomController.deleteClassroom
);

module.exports = router;