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

router.post(
  '/announcement/create',
  protect,
  roleCheck('teacher', 'admin'),
  createAnnouncement
);

router.get(
  '/announcement',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncements
);

router.get(
  '/announcement/:id',
  protect,
  roleCheck('parent', 'teacher', 'admin'),
  getAnnouncementById
);

router.put(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  updateAnnouncement
);

router.delete(
  '/announcement/:id',
  protect,
  roleCheck('teacher', 'admin'),
  deleteAnnouncement
);

module.exports = router;
