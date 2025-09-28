const express = require('express');
const router = express.Router();
const liveReportController = require('../controllers/liveReportController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    liveReportController.getAllLiveReports
);

router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    liveReportController.getLiveReportById
);

router.post(
    '/',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    upload.single('photo'),
    liveReportController.createLiveReport
);

router.put(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    upload.single('photo'),
    liveReportController.updateLiveReport
);

router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    liveReportController.deleteLiveReport
);

module.exports = router;