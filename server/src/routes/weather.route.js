const express = require('express');
const weatherController = require('../controllers/weather.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Manajemen data cuaca dengan API eksternal
 */

/**
 * @swagger
 * /weather/{location}:
 *   get:
 *     summary: Mengambil data cuaca berdasarkan lokasi
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Nama kota atau lokasi
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
 *         description: Bad request
 *       404:
 *         description: Data cuaca tidak ditemukan
 *       500:
 *         description: Terjadi error di server
 */

router.get('/weather/:location', weatherController.fetchWeather);

module.exports = router;