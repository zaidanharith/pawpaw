const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const weatherRoutes = require('./weather.route');

router.use('/', authRoutes);
router.use('/', weatherRoutes);

module.exports = router;