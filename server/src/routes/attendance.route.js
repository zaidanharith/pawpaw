const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth.middleware');

const {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceByStudent
} = require('../controllers/attendance.controller');

// Create attendance → hanya teacher dan admin
router.post(
  '/attendance/create',
  protect,
  roleCheck('teacher', 'admin'),
  createAttendance
);

// Get all attendance records → teacher & admin
router.get(
  '/attendance',
  protect,
  roleCheck('teacher', 'admin'),
  getAllAttendances
);

// Get attendance by ID → parent, teacher, admin
router.get(
  '/attendance/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAttendanceById
);

// Update attendance → teacher & admin
router.put(
  '/attendance/:id',
  protect,
  roleCheck('teacher', 'admin'),
  updateAttendance
);

// Delete attendance → hanya admin
router.delete(
  '/attendance/:id',
  protect,
  roleCheck('admin'),
  deleteAttendance
);

// Get attendance by student ID → parent, teacher, admin
router.get(
  '/attendance/student/:studentId',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAttendanceByStudent
);

module.exports = router;
