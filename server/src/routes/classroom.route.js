const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Classroom
 *   description: Manajemen kelas dalam sistem
 */

/**
 * @swagger
 * /classroom:
 *   get:
 *     summary: Ambil data classroom
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar classroom berhasil diambil
 *       403:
 *         description: Akses ditolak
 */

router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    classroomController.getAllClassrooms
);

/**
 * @swagger
 * /classroom/{id}:
 *   get:
 *     summary: Ambil classroom berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID classroom
 *     responses:
 *       200:
 *         description: Detail classroom
 *       404:
 *         description: Classroom tidak ditemukan
 */

router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    classroomController.getClassroomById
);

/**
 * @swagger
 * /classroom:
 *   post:
 *     summary: Buat classroom baru
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
 *                 example: TK-A
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca9"]
 *               teacher:
 *                 type: string
 *                 example: 64d4e8b1d165537831aeca8
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca7"]
 *     responses:
 *       201:
 *         description: Classroom berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */

router.post(
    '/',
    authMiddleware,
    authorizeRole('admin'),
    classroomController.createClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   put:
 *     summary: Update classroom berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID classroom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *               teacher:
 *                 type: string
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Classroom berhasil diperbarui
 *       404:
 *         description: Classroom tidak ditemukan
 */

router.put(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    classroomController.updateClassroom
);

/**
 * @swagger
 * /classroom/{id}:
 *   delete:
 *     summary: Hapus classroom berdasarkan ID
 *     tags: [Classroom]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID classroom
 *     responses:
 *       200:
 *         description: Classroom berhasil dihapus
 *       404:
 *         description: Classroom tidak ditemukan
 */

router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('admin'),
    validateObjectId,
    classroomController.deleteClassroom
);

module.exports = router;