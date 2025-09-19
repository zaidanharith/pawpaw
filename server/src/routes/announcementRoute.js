const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');

// POST "/" → createAnnouncement, hanya untuk teacher dan admin
router.post(
    '/',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    announcementController.createAnnouncement
);

// GET "/" → getAnnouncements, bisa diakses parent, teacher, admin
router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    announcementController.getAnnouncements
);

// GET "/:id" → getAnnouncementById, bisa diakses parent, teacher, admin, dengan validateObjectId
router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    announcementController.getAnnouncementById
);

// PUT "/:id" → updateAnnouncement, hanya teacher dan admin, dengan validateObjectId
router.put(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    announcementController.updateAnnouncement
);

// DELETE "/:id" → deleteAnnouncement, hanya teacher dan admin, dengan validateObjectId
router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    announcementController.deleteAnnouncement
);

module.exports = router;