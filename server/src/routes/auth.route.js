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
router.post('/auth/reset-password', protect, authController.resetPassword);

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

/**
 * @swagger
 * /auth/register-face:
 *   post:
 *     summary: Mendaftarkan face descriptor untuk user
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
 *               - userId
 *               - descriptor
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "clx1234567890"
 *               descriptor:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [0.123, -0.456, ...]
 *     responses:
 *       200:
 *         description: Face descriptor berhasil didaftarkan
 *       400:
 *         description: Data tidak lengkap
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.post('/auth/register-face', protect, authController.registerFaceDescriptor);

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
 * /auth/profile:
 *   put:
 *     summary: Edit Profil User
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data yang akan diperbarui oleh user (Name, Username, Email, Phone Number)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil memperbarui profil
 *       400:
 *         description: Bad request (field tidak lengkap)
 *       401:
 *         description: Tidak sah (token tidak valid)
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.put('/auth/profile', protect, authController.updateProfile);

/**
 * @swagger
 * /auth/verify-face-token:
 *   post:
 *     summary: Verifikasi Face Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token berhasil diverifikasi
 *       400:
 *         description: Bad request
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.post('/auth/verify-face-token', authController.verifyFaceToken);

module.exports = router;
