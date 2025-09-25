const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const weatherRoutes = require('./weather.route');
const announcementRoutes = require('./announcement.route');

const studentRoutes = require('./student.route');
const activityRoutes = require('./activity.route');

router.use('/', authRoutes);
router.use('/', weatherRoutes);
router.use('/', announcementRoutes);

router.use('/', studentRoutes); 
router.use('/', activityRoutes);

module.exports = router;