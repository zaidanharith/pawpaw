const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroom.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Classroom
 *   description: Manajemen kelas dalam sistem
 */

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
 *                 example: ["64d4e8b1d165537831aeca91"]
 *               teacher:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94"]
 *     responses:
 *       201:
 *         description: Classroom berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */
// POST CREATE CLASSROOM
router.post(
    '/classroom/create',
    protect,
    roleCheck('admin'),
    classroomController.createClassroom
);

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
    '/classroom',
    protect,
    roleCheck('parent', 'teacher', 'admin'),
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
    '/classroom/:id',
    protect,
    roleCheck('parent', 'teacher', 'admin'),
    classroomController.getClassroomById
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
 *                 example: "TK-A Updated"
 *               student:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca91", "64d4e8b1d165537831aeca92"]
 *               teacher:
 *                 type: string
 *                 example: "64d4e8b1d165537831aeca90"
 *               activity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64d4e8b1d165537831aeca94", "64d4e8b1d165537831aeca95"]
 *     responses:
 *       200:
 *         description: Classroom berhasil diperbarui
 *       404:
 *         description: Classroom tidak ditemukan
 */
router.put(
    '/classroom/:id',
    protect,
    roleCheck('teacher', 'admin'),
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
    '/classroom/:id',
    protect,
    roleCheck('admin'),
    classroomController.deleteClassroom
);

module.exports = router;