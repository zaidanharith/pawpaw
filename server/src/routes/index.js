const express = require('express');
const router = express.Router();

const activityRoutes = require('./activity.route');
const announcementRoutes = require('./announcement.route');
const attendanceRoutes = require('./attendance.route');
const authRoutes = require('./auth.route');
const messageRoutes = require('./message.route');
const studentRoutes = require('./student.route');
const uploadRoutes = require('./upload.route');
const weatherRoutes = require('./weather.route');
const liveReportRoutes = require('./liveReport.route');
const classroomRoutes = require('./classroom.route');

router.use('/', activityRoutes);
router.use('/', announcementRoutes);
router.use('/', attendanceRoutes);
router.use('/', authRoutes);
router.use('/', classroomRoutes);
router.use('/', liveReportRoutes);
router.use('/', messageRoutes);
router.use('/', studentRoutes); 
router.use('/', uploadRoutes); 
router.use('/', weatherRoutes);

module.exports = router;