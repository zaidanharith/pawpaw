const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middleware/authMiddleware');

// 🔹 CREATE activity → hanya teacher/admin
router.post(
  '/',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  activityController.createActivity
);

// 🔹 GET all activities → parent, teacher, admin
router.get(
  '/',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  activityController.getActivities
);

// 🔹 GET activity by ID
router.get(
  '/:id',
  authMiddleware,
  authorizeRole('parent', 'teacher', 'admin'),
  validateObjectId,
  activityController.getActivityById
);

// 🔹 UPDATE activity → teacher/admin
router.put(
  '/:id',
  authMiddleware,
  authorizeRole('teacher', 'admin'),
  validateObjectId,
  activityController.updateActivity
);

// 🔹 DELETE activity → admin only
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole('admin'),
  validateObjectId,
  activityController.deleteActivity
);

module.exports = router;
