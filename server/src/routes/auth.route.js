const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

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
 *               - email
 *               - phoneNumber
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: syahroni127
 *               name:
 *                 type: string
 *                 example: Syahroni
 *               email:
 *                 type: string
 *                 example: syahroni@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "08123456789"
 *               password:
 *                 type: string
 *                 example: rahasia1234
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TEACHER, PARENT]
 *                 example: TEACHER
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
router.post('/auth/register', protect, requireRole('ADMIN'), authController.register);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Username atau password salah
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login/Register dengan Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - googleId
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               googleId:
 *                 type: string
 *                 example: "1234567890"
 *               picture:
 *                 type: string
 *                 example: https://lh3.googleusercontent.com/a/default-user
 *     responses:
 *       200:
 *         description: Login/Register dengan Google berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/auth/google', authController.googleAuth);

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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Melihat profil user (alias)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan profil user
 *       401:
 *         description: Akses ditolak
 */
router.get('/auth/me', protect, authController.getProfile);

/**
 * @swagger
 * /auth/face-login:
 *   post:
 *     summary: Login dengan Face Recognition
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descriptor
 *             properties:
 *               descriptor:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [0.123, -0.456, ...]
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Wajah tidak cocok
 *       400:
 *         description: Descriptor tidak valid
 *       500:
 *         description: Server error
 */
router.post('/auth/face-login', authController.faceLogin);

module.exports = router;
