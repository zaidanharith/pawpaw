const express = require('express');
const router = express.Router();
// PERBAIKI PATH IMPORT:
const activityController = require('../controllers/activity.controller'); // <- tambahkan titik
const { protect, roleCheck } = require('../middleware/auth.middleware');

// 🔹 CREATE activity → hanya teacher/admin
router.post(
  '/activity/create',
  protect,
  roleCheck('teacher', 'admin'),
  activityController.createActivity
);

// 🔹 GET all activities → parent, teacher, admin
router.get(
  '/',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  activityController.getAllActivities
);

// 🔹 GET activity by ID
router.get(
  '/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  activityController.getActivityById
);

// 🔹 UPDATE activity → teacher/admin
router.put(
  '/:id',
  protect,
  roleCheck('teacher', 'admin'),
  activityController.updateActivity
);

// 🔹 DELETE activity → admin only
router.delete(
  '/:id',
  protect,
  roleCheck('admin'),
  activityController.deleteActivity
);

module.exports = router;