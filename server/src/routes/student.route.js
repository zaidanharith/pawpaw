const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth.middleware');

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');

// Create student → hanya teacher dan admin
router.post(
  '/student/create',
  protect,
  roleCheck('teacher', 'admin'),
  createStudent
);

// Get all students → bisa diakses parent, teacher, admin
router.get(
  '/',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAllStudents
);

// Get student by ID → parent, teacher, admin
router.get(
  '/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getStudentById
);

// Update student → hanya teacher dan admin
router.put(
  '/:id',
  protect,
  roleCheck('teacher', 'admin'),
  updateStudent
);

// Delete student → hanya teacher dan admin
router.delete(
  '/:id',
  protect,
  roleCheck('teacher', 'admin'),
  deleteStudent
);

module.exports = router;