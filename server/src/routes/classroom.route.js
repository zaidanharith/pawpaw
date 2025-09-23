const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { authMiddleware, authorizeRole, validateObjectId } = require('../middlewares/authMiddleware');

// GET "/" → getAllClassrooms, bisa diakses parent, teacher, admin
router.get(
    '/',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    classroomController.getAllClassrooms
);

// GET "/:id" → getClassroomById, bisa diakses parent, teacher, admin, dengan validateObjectId
router.get(
    '/:id',
    authMiddleware,
    authorizeRole('parent', 'teacher', 'admin'),
    validateObjectId,
    classroomController.getClassroomById
);

// POST "/" → createClassroom, hanya untuk teacher dan admin
router.post(
    '/',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    classroomController.createClassroom
);

// PUT "/:id" → updateClassroom, hanya untuk teacher dan admin, dengan validateObjectId
router.put(
    '/:id',
    authMiddleware,
    authorizeRole('teacher', 'admin'),
    validateObjectId,
    classroomController.updateClassroom
);

// DELETE "/:id" → deleteClassroom, hanya untuk admin, dengan validateObjectId
router.delete(
    '/:id',
    authMiddleware,
    authorizeRole('admin'),
    validateObjectId,
    classroomController.deleteClassroom
);

module.exports = router;