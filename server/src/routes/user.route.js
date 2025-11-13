const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manajemen data pengguna (admin, guru, orang tua)
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Ambil semua pengguna
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Akses ditolak
 */
router.get(
  "/user",
  protect,
  requireRole("ADMIN", "TEACHER"),
  userController.getAllUsers
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Ambil detail pengguna berdasarkan ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.get(
  "/user/:id",
  protect,
  requireRole("ADMIN", "TEACHER"),
  userController.getUserById
);

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Menambah pengguna baru
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: admin1
 *             name: Admin Satu
 *             email: admin1@email.com
 *             phoneNumber: "08123456789"
 *             password: "password"
 *             role: "ADMIN"
 *     responses:
 *       201:
 *         description: Pengguna berhasil dibuat
 *       403:
 *         description: Akses ditolak (hanya admin)
 */
router.post(
  "/user/create",
  protect,
  requireRole("ADMIN"),
  userController.createUser
);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update data pengguna
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diperbarui
 *       403:
 *         description: Akses ditolak
 */
router.put(
  "/user/:id",
  protect,
  requireRole("ADMIN"),
  userController.updateUser
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Hapus pengguna
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       403:
 *         description: Akses ditolak (hanya admin)
 */
router.delete(
  "/user/:id",
  protect,
  requireRole("ADMIN"),
  userController.deleteUser
);

module.exports = router;