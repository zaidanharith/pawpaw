const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middleware/authMiddleware');

// 🔹 CREATE attendance (teacher/admin)
router.post(
  '/',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  attendanceController.createAttendance
);

// 🔹 GET all attendance records
router.get(
  '/',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  attendanceController.getAttendances
);

// 🔹 GET attendance by ID -> ambil 1 record attendance tertentu
router.get(
  '/:id',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  validateObjectId,
  attendanceController.getAttendanceById
);

// 🔹 UPDATE attendance
router.put(
  '/:id',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  validateObjectId,
  attendanceController.updateAttendance
);

// 🔹 DELETE attendance
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  validateObjectId,
  attendanceController.deleteAttendance
);

// 🔹 GET by studentId → ambil semua attendance milik 1 siswa
router.get(
  '/student/:studentId',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  validateObjectId,
  attendanceController.getAttendanceByStudent
);

module.exports = router;
