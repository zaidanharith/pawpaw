const express = require('express');
const router = express.Router();

const activityRoute = require('./activity.route');
const announcementRoute = require('./announcement.route');
const attendanceRoute = require('./attendance.route');
const authRoute = require('./auth.route');
const messageRoute = require('./message.route');
const studentRoute = require('./student.route');
const uploadRoute = require('./upload.route');
const weatherRoute = require('./weather.route');
const liveReportRoute = require('./liveReport.route');
const classroomRoute = require('./classroom.route');
const quarterlyReportRoute = require('./quarterlyReport.route');

router.use('/', activityRoute);
router.use('/', announcementRoute);
router.use('/', attendanceRoute);
router.use('/', authRoute);
router.use('/', classroomRoute);
router.use('/', liveReportRoute);
router.use('/', messageRoute);
router.use('/', studentRoute); 
router.use('/', uploadRoute); 
router.use('/', weatherRoute);
router.use('/', quarterlyReportRoute);

module.exports = router;