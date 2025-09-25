const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect, roleCheck } = require('../middleware/auth.middleware');

router.post(
  '/attendance/create',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.createAttendance
);

router.get(
  '/attendance',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.getAllAttendances
);

router.get(
  '/attendance/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  attendanceController.getAttendanceById
);

router.put(
  '/attendance/:id',
  protect,
  roleCheck('teacher', 'admin'),
  attendanceController.updateAttendance
);

router.delete(
  '/attendance/:id',
  protect,
  roleCheck('admin'),
  attendanceController.deleteAttendance
);

router.get(
  '/attendance/student/:studentId',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  attendanceController.getAttendanceByStudent
);

module.exports = router;
