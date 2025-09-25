const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const weatherRoutes = require('./weather.route');
const announcementRoutes = require('./announcement.route');
const messageRoutes = require('./message.route');


const studentRoutes = require('./student.route');
const activityRoutes = require('./activity.route');


const attendanceRoutes = require('./attendance.route');

router.use('/', authRoutes);
router.use('/', weatherRoutes);
router.use('/', announcementRoutes);
router.use('/', messageRoutes);

router.use('/', studentRoutes); 
router.use('/', activityRoutes);


router.use('/', attendanceRoutes);

module.exports = router;