const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReportController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// GET "/" → getAllLiveReports, bisa diakses parent, teacher, admin
router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    liveReportController.getAllLiveReports
);

// GET "/:id" → getLiveReportById, bisa diakses parent, teacher, admin
router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    liveReportController.getLiveReportById
);

// POST "/" → createLiveReport, hanya teacher & admin, dengan upload foto
router.post(
    '/',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    upload.single('photo'), // field foto bernama 'photo'
    liveReportController.createLiveReport
);

// PUT "/:id" → updateLiveReport, hanya teacher & admin, dengan upload foto
router.put(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    upload.single('photo'),
    liveReportController.updateLiveReport
);

// DELETE "/:id" → deleteLiveReport, hanya teacher & admin
router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    liveReportController.deleteLiveReport
);

module.exports = router;