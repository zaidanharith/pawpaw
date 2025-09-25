const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const weatherRoutes = require('./weather.route');
const announcementRoutes = require('./announcement.route');


const attendanceRoutes = require('./attendance.route');

router.use('/', authRoutes);
router.use('/', weatherRoutes);
router.use('/', announcementRoutes);


router.use('/', attendanceRoutes);

module.exports = router;