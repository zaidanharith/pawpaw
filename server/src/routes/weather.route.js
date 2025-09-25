const express = require('express');
const weatherController = require('../controllers/weather.controller');

const router = express.Router();

/**
 * @swagger
 * /api/weather/{location}:
 *   get:
 *     summary: Ambil data cuaca berdasarkan lokasi
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Nama kota atau lokasi (contoh: yogyakarta)
 *     responses:
 *       200:
 *         description: Data cuaca berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                   example: Yogyakarta
 *                 temperature:
 *                   type: number
 *                   example: 30
 *                 condition:
 *                   type: string
 *                   example: Partly cloudy
 *       400:
 *         description: Request tidak valid
 *       404:
 *         description: Data cuaca tidak ditemukan
 *       500:
 *         description: Terjadi error di server
 */

router.get('/weather/:location', weatherController.fetchWeather);

module.exports = router;