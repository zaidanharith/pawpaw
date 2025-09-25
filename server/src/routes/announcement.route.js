const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth.middleware');

const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcement.controller');

// Create announcement → hanya teacher dan admin
router.post(
  '/announcement/create',
  protect,
  roleCheck('teacher', 'admin'),
  createAnnouncement
);

// Get all announcements → bisa diakses parent, teacher, admin
router.get(
  '/announcement',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncements
);

// Get announcement by ID → parent, teacher, admin
router.get(
  '/announcement/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncementById
);

// Update announcement → hanya teacher dan admin
router.put(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  updateAnnouncement
);

// Delete announcement → hanya teacher dan admin
router.delete(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  deleteAnnouncement
);

module.exports = router;
