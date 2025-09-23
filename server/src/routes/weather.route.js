const express = require('express');
const weatherController = require('../controllers/weather.controller');

// const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/weather/:location', weatherController.fetchWeather);

module.exports = router;