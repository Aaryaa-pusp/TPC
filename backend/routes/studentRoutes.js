const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.get('/events', verifyToken, requireRole(['student', 'admin']), studentController.getEvents);
router.get('/announcements', verifyToken, requireRole(['student', 'admin']), studentController.getAnnouncements);
router.post('/verify', verifyToken, requireRole(['student']), upload.single('idCard'), studentController.submitVerification);

module.exports = router;
