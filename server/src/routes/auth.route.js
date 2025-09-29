const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Manajemen user dan autentikasi
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Mendaftarkan user baru
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: syahroni127
 *               password:
 *                 type: string
 *                 example: rahasia1234
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, parent]
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       400:
 *         description: Bad request
 *       401:
 *         description: Akses ditolak
 *       403:
 *         description: Hanya admin yang dapat mendaftarkan user baru
 */
router.post('/auth/register', protect, roleCheck('admin'), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin1
 *               password:
 *                 type: string
 *                 example: PAW123
 *     responses:
 *       200:
 *         description: User berhasil login
 *       401:
 *         description: Username atau password salah
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User berhasil logout
 *       401:
 *         description: Akses ditolak
 */
router.post('/auth/logout', protect, authController.logout);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Mengatur ulang password user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: syahroni123
 *               newPassword:
 *                 type: string
 *                 example: rahasiabaru1234
 *     responses:
 *       200:
 *         description: Password berhasil diatur ulang
 *       400:
 *         description: Bad request
 */
router.post('/auth/reset-password', authController.resetPassword);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Melihat profil user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan profil user
 *       401:
 *         description: Akses ditolak
 */
router.get('/auth/profile', protect, authController.getProfile);

module.exports = router;
